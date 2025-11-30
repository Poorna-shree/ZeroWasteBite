import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Predefined options
const optionsList = [
  "🌾 How can farmers upload their produce?",
  "❤️ How can I donate food?",
  "📖 What is ZeroWaste Bites about?",
  "⚙️ How does it work?",
  "🏢 How do NGOs participate?",
  "🧑‍🍳 How can restaurants join?",
  "🚚 How is food delivery handled?",
  "🌍 What impact does this create?",
  "🔐 Login / Signup issues",
  "📧 Contact & Support",
];

// Map each option to its response
const optionReplies = {
  "🌾 How can farmers upload their produce?":
    "🌾 Farmers can upload fresh produce via the Farmer Dashboard — add name, images, quantity and price so buyers or NGOs can request them.",
  "❤️ How can I donate food?":
    "❤️ Donors can list surplus food on the Donor Portal — the system matches you with nearby NGOs or receivers for pickup.",
  "📖 What is ZeroWaste Bites about?":
    "📖 ZeroWaste Bites connects farmers, restaurants, and NGOs to reduce food waste and support local communities sustainably.",
  "⚙️ How does it work?":
    "⚙️ How it works:\n1) Farmers upload produce\n2) Donors list surplus food\n3) NGOs request items\n4) System matches supply & demand\n5) Volunteers/delivery partners handle pickups.",
  "🏢 How do NGOs participate?":
    "🏢 NGOs can register, request items, and coordinate pickups to distribute food to those in need.",
  "🧑‍🍳 How can restaurants join?":
    "🧑‍🍳 Restaurants can list unsold or excess food for donation and partner with NGOs for regular pickups.",
  "🚚 How is food delivery handled?":
    "🚚 After confirmation, a delivery partner or volunteer is assigned to pick up and both donor & receiver can track the process.",
  "🌍 What impact does this create?":
    "🌍 Donations reduce waste and support communities — helping sustainability, food security, and local economies.",
  "🔐 Login / Signup issues":
    "🔐 If you have login/signup issues: check your email/password, try password reset, or contact us at <a href='mailto:zerowastebite@gmail.com'>zerowastebite@gmail.com</a>",
  "📧 Contact & Support":
    "📧 For support or partnership inquiries, contact us at <a href='mailto:zerowastebite@gmail.com'>zerowastebite@gmail.com</a>",
};

router.post("/", async (req, res) => {
  try {
    const { message, firstLoad } = req.body; // <- check firstLoad flag
    const options = optionsList; // always show options

    // If firstLoad is true, send initial options
    if (firstLoad) {
      return res.json({
        reply: "👋 Hi there! Please choose one of the following options:",
        options,
      });
    }

    // If no message, also show options
    if (!message || message.trim() === "") {
      return res.json({
        reply: "👋 Hi there! Please choose one of the following options:",
        options,
      });
    }

    let reply = "";

    // Check if user clicked an option
    if (optionReplies[message]) {
      reply = optionReplies[message];
    } else {
      // fallback to OpenAI for other queries
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are ZeroWaste Bites assistant. Keep answers friendly, concise, focused on food donations, sustainability, and how users can interact with the platform.",
          },
          { role: "user", content: message },
        ],
      });
      reply = completion.choices[0].message.content.trim();
    }

    return res.json({ reply, options });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ reply: "Server error", options: optionsList });
  }
});


export default router;
