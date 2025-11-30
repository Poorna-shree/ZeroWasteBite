import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import { sendDeliveryOtpMail, sendNewOrderMailToOwner } from "../utils/mail.js";
import RazorPay from "razorpay"
import dotenv from "dotenv";
dotenv.config();

let instance = new RazorPay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Place Order Controller
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // ✅ Validate cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Validate deliveryAddress
    if (
      !deliveryAddress?.text ||
      !deliveryAddress?.latitude ||
      !deliveryAddress?.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Please send complete deliveryAddress" });
    }

    // ✅ Group items by shop _id
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop?._id || item.shop;
      if (!shopId) return; // skip if shop info missing
      if (!groupItemsByShop[shopId]) groupItemsByShop[shopId] = [];
      groupItemsByShop[shopId].push(item);
    });

    // ✅ Create shopOrders array
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error(`Shop ${shopId} not found`);
        }
        const items = groupItemsByShop[shopId];

        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      })
    );

    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      // ✅ Send email to each shop owner
      for (let shopOrder of shopOrders) {
        const shop = await Shop.findById(shopOrder.shop).populate("owner");
        if (shop?.owner?.email) {
          await sendNewOrderMailToOwner(shop.owner, newOrder._id, shop.name);
        }
      }

      return res.status(200).json({ razorOrder, orderId: newOrder._id });
    }

    // ✅ Save order (COD / offline)
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate("shopOrders.shopOrderItems.item", "name image price");
    await newOrder.populate("shopOrders.shop", "name");

    // ✅ Send email to each shop owner for COD/offline
    for (let shopOrder of shopOrders) {
      const shop = await Shop.findById(shopOrder.shop).populate("owner");
      if (shop?.owner?.email) {
        await sendNewOrderMailToOwner(shop.owner, newOrder._id, shop.name);
      }
    }

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await Order.populate("shopOrders.shopOrderItems.item", "name image price");
    await Order.populate("shopOrders.shop", "name");

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: `verify payment error ${error}` });
  }
};

// ✅ Get My Orders Controller
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find(
          (o) => o.owner._id.toString() === req.userId
        ),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
      }));

      return res.status(200).json(filteredOrders);
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    return res.status(500).json({ message: `get User order error ${error}` });
  }
};

// ✅ Update Order Status
export const updateOrdersStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.find((o) => o.shop.equals(shopId));
    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;
    let deliveryBoysPayload = [];

    if (status === "out of delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 50000000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableBoys.map((b) => b._id);
      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message:
            "Order status updated but there is no available delivery boys",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await order.save();

    const updatedShopOrder = order.shopOrders.find((o) => o.shop.equals(shopId));

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    );

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get Delivery Boy Assignment
export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.name,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) =>
          so._id.equals(a.shopOrderId)
        )?.shopOrderItems || [],
      subtotal: a.order.shopOrders.find((so) =>
        so._id.equals(a.shopOrderId)
      )?.subtotal,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: `get assignment error ${error}` });
  }
};

// ✅ Accept Order
export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(400).json({ message: "Assignment not found" });
    }
    if (assignment.status !== "brodcasted") {
      return res.status(400).json({ message: "Assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order" });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString()
    );
    if (shopOrder) {
      shopOrder.assignedDeliveryBoy = req.userId;
    }
    await order.save();

    return res.status(200).json({
      message: "Order accepted",
    });
  } catch (error) {
    return res.status(500).json({ message: `accept order error ${error}` });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned"
    })
    .populate("shop","name")
    .populate("assignedTo","fullName email mobile location")
    .populate({
      path:"order",
      populate:[{path:"user",select:"fullName email location mobile "}]
    });

    if(!assignment){
      return res.status(400).json({message:"assignment not found"});
    }
    if(!assignment.order){
      return res.status(400).json({message:"order not found"});
    }

    const shopOrder = assignment.order.shopOrders.find(so => String(so._id) === String(assignment.shopOrderId));
    if(!shopOrder){
      return res.status(400).json({message:"shopOrder not found"});
    }

    let deliveryBoyLocation = { lat: null, lon: null};
    if (assignment.assignedTo.location.coordinates.length === 2){
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = {lat:null, lon:null};
    if(assignment.order.deliveryAddress){
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id:assignment.order._id,
      user:assignment.order.user,
      shopOrder,
      deliveryAddress:assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation
    });

  } catch (error) {
     return res.status(500).json({ message: `current order error ${error}` });
  }
};

export const getOrderById = async (req,res) => {
  try {
    const {orderId} = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({ path:"shopOrders.shop", model:"Shop" })
      .populate({ path:"shopOrders.assignedDeliveryBoy", model:"User" })
      .populate({ path:"shopOrders.shopOrderItems.item", model:"Item" })
      .lean();

    if(!order){
      return res.status(400).json({message:"order not found"});
    }
    return res.status(200).json(order);

  } catch (error) {
     return res.status(500).json({ message: `get by id order error ${error}` });
  }
};

export const sentDeliveryOtp = async (req,res) => {
  try {
    const {orderId,shopOrderId} = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if(!order || !shopOrder){
      return res.status(400).json({message:"enter valid order/shopOrderid"});
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5*60*1000;
    await order.save();
    await sendDeliveryOtpMail(order.user, otp);

    return res.status(200).json({message:`Otp sent Successfully to ${order?.user?.fullName}`});
  
  } catch (error) {
     return res.status(500).json({ message: `delivery otp error ${error}` });
  }
};

export const verifyDeliveryOtp = async (req,res) => {
  try {
    const {orderId,shopOrderId,otp} = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);
    if(!order || !shopOrder){
      return res.status(400).json({message:"enter valid order/shopOrderid"});
    }
    if(shopOrder.deliveryOtp!==otp || !shopOrder.otpExpires || shopOrder.otpExpires<Date.now()){
      return res.status(400).json({message:"Invalid/Expired Otp"});
    }

    shopOrder.status="delivered";
    shopOrder.deliveredAt=Date.now();
    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId:shopOrder._id,
      order:order._id,
      assignedTo:shopOrder.assignedDeliveryBoy
    });

    return res.status(200).json({message:"Order Delivered Successfully"});
    
  } catch (error) {
    return res.status(500).json({ message: `verify delivery otp error ${error}` });
  }
};
