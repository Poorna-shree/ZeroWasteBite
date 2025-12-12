import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});





export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Delivery OTP",
      html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("✅ Delivery OTP sent to", user.email);
  } catch (err) {
    console.error("❌ Delivery OTP error:", err);
  }
};



// Send delivery OTP
export const sendDeliveryOtpMail = async (user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Delivery OTP",
    html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

// Send new order notification to shop owner
export const sendNewOrderMailToOwner = async (owner, orderId, shopName) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: owner.email,
    subject: "New Order Received",
    html: `
      <p>Hi ${owner.name || "Owner"},</p>
      <p>You have received a new order for your shop <b>${shopName}</b>.</p>
      <p>Order ID: <b>${orderId}</b></p>
      <p>Please check your dashboard to process it.</p>
      <br/>
      <p>Thanks,<br/>ZeroWasteBite Team</p>
    `,
  });
};
