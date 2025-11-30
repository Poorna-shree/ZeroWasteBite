import Chat from "../models/chat.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Helper: build participants array from order/shopOrder
 */
const buildParticipantsFromOrder = (order, shopOrder) => {
  const participants = [];

  if (order?.user) {
    participants.push({
      userId: order.user._id,
      role: "customer",
      name: order.user.fullName || "Customer",
      phone: order.user.mobile || "",
    });
  }

  if (shopOrder?.owner) {
    const owner = shopOrder.owner;
    participants.push({
      userId: owner._id,
      role: "owner",
      name: owner.fullName || "Owner",
      phone: owner.mobile || "",
    });
  }

  if (shopOrder?.assignedDeliveryBoy) {
    const db = shopOrder.assignedDeliveryBoy;
    participants.push({
      userId: db._id,
      role: "delivery",
      name: db.fullName || "Delivery Boy",
      phone: db.mobile || "",
    });
  }

  return participants;
};

/**
 * GET chat by shopOrderId
 */
export const getChatByShopOrderId = async (req, res) => {
  try {
    const { shopOrderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(shopOrderId))
      return res.status(400).json({ message: "Invalid shopOrderId" });

    let chat = await Chat.findOne({ shopOrderId }).populate(
      "messages.sender",
      "fullName mobile"
    );

    if (!chat) {
      const order = await Order.findOne({ "shopOrders._id": shopOrderId })
        .populate("user", "fullName mobile")
        .populate({
          path: "shopOrders.owner",
          model: "User",
          select: "fullName mobile",
        })
        .populate({
          path: "shopOrders.assignedDeliveryBoy",
          model: "User",
          select: "fullName mobile",
        });

      if (!order) return res.status(404).json({ message: "Order not found" });

      const shopOrder = order.shopOrders.id(shopOrderId);
      const participants = buildParticipantsFromOrder(order, shopOrder);

      chat = await Chat.create({ shopOrderId, participants, messages: [] });
      chat = await Chat.findById(chat._id).populate("messages.sender", "fullName mobile");
    }

    return res.json({ success: true, chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST sendMessage
 */
export const sendMessage = async (req, res) => {
  try {
    const { shopOrderId, text, tempId } = req.body;
    const sender = req.userId; // assuming auth middleware sets req.userId
    const io = req.app.get("io");

    if (!shopOrderId || !text)
      return res.status(400).json({ message: "shopOrderId and text required" });

    let chat = await Chat.findOne({ shopOrderId });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const user = await User.findById(sender).select("fullName role");

    const messageObj = {
      sender,
      senderType:
        user.role === "user"
          ? "customer"
          : user.role === "owner"
          ? "owner"
          : "delivery",
      message: text,
      timestamp: new Date(),
    };

    chat.messages.push(messageObj);
    await chat.save();
    await chat.populate("messages.sender", "fullName mobile");

    // Emit to the specific room (order-based)
    const lastMsg = chat.messages[chat.messages.length - 1];
    if (io) {
      io.to(String(shopOrderId)).emit("receive-message", {
        _id: lastMsg._id,
        senderId: sender,
        sender: lastMsg.sender.fullName || lastMsg.sender.mobile || "Unknown",
        senderType: messageObj.senderType,
        text: lastMsg.message,
        time: lastMsg.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase(),
        shopOrderId,
      });
    }

    return res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default { sendMessage, getChatByShopOrderId };

