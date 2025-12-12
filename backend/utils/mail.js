import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,  // Gmail App Password
  },
});

// Send OTP for password reset
export const sendOtpMAil = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: to,   // ✅ use the function argument
      subject: "Reset your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log(`✅ OTP sent to ${to}`);
  } catch (err) {
    console.error(`❌ Send OTP failed: ${err}`);
    throw err;  // rethrow to be handled in the API route
  }
};







// Send delivery OTP
export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Delivery OTP",
      html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log(`✅ Delivery OTP sent to ${user.email}`);
  } catch (err) {
    console.error(`❌ Delivery OTP error: ${err}`);
  }
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
