// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState([]); // 👈 store chatbot options
  const [showOptions, setShowOptions] = useState(false); // 👈 toggle for showing options

  const toggleAbout = () => setShowAbout((prev) => !prev);
  const toggleChatbot = () => setShowChatbot((prev) => !prev);

  // 👇 Fetch initial greeting and options on chatbot open
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/chat", {
          firstLoad: true,
        });
        const botMsg = { sender: "bot", text: res.data.reply };
        setMessages([botMsg]);
        setOptions(res.data.options || []);
      } catch (err) {
        console.error("Chatbot initial load error:", err);
        setMessages([
          { sender: "bot", text: "⚠️ Unable to load chatbot. Please try again." },
        ]);
      }
    };

    if (showChatbot && messages.length === 0) {
      fetchInitialMessage();
    }
  }, [showChatbot]);

  // ✨ Function to send message to backend
  const handleSend = async (msg) => {
    const userInput = msg || input;
    if (!userInput.trim()) return;

    const userMsg = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowOptions(false); // hide options after user interacts

    try {
      const res = await axios.post("http://localhost:8000/api/chat", {
        message: userInput,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
      setOptions(res.data.options || []);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to chatbot server." },
      ]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-center overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="pt-20"
      >
        <h1 className="text-5xl font-extrabold text-green-700 mb-4 flex items-center justify-center gap-2">
          <Leaf className="text-green-600" size={40} />
          ZeroWaste Bites
        </h1>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-8">
  Empowering <strong>farmers</strong> to connect directly with consumers and restaurants, 
  promoting sustainability and reducing <strong>food waste</strong> through efficient distribution of surplus produce 🌾.
</p>


        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white border border-green-600 text-green-700 px-6 py-3 rounded-xl hover:bg-green-100 transition-all duration-300"
          >
            Sign Up
          </button>
          <button
            onClick={toggleAbout}
            className={`${
              showAbout ? "bg-green-600 text-white" : "bg-green-200 text-green-800"
            } px-6 py-3 rounded-xl hover:bg-green-300 transition-all duration-300`}
          >
            {showAbout ? "About" : "About Us"}
          </button>
        </div>
      </motion.div>

      {/* About Section */}
      <AnimatePresence>
        {showAbout && (
          <motion.section
            key="about"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.6 }}
            className="mt-20 px-6 py-12 bg-white shadow-lg rounded-2xl max-w-3xl"
          >
            <h2 className="text-3xl font-bold text-green-700 mb-4">About ZeroWaste Bites</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              <strong>ZeroWaste Bites</strong> connects <strong>farmers</strong> directly to consumers,
              restaurants, and local buyers. Farmers can easily <strong>upload details of their produce</strong>,
              including images, quantity, and price — making it simple for buyers to discover and purchase fresh, local food.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              It works like a <strong>“Swiggy for farmers”</strong> — delivering <strong>fresh farm produce</strong> straight
              from the source. This reduces waste, ensures fair pricing, and empowers the agricultural community.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              ZeroWaste Bites also enables restaurants and individuals to
              <strong> donate surplus food</strong> to NGOs or communities in need — creating a sustainable food ecosystem.
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <button
          onClick={toggleChatbot}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl"
        >
          <MessageCircle size={28} />
        </button>
      </motion.div>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            key="chatbot"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 bg-white shadow-2xl rounded-2xl border border-green-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-green-600 text-white px-4 py-3">
              <h3 className="font-semibold">ZeroWaste Chatbot</h3>
              <button onClick={toggleChatbot}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl text-sm ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
              ))}

              {/* 👇 Toggle button for options */}
              {options.length > 0 && (
                <div className="flex justify-center mt-3">
                  <button
                    onClick={() => setShowOptions((prev) => !prev)}
                    className="text-green-700 text-sm flex items-center gap-1 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-full border border-green-200"
                  >
                    {showOptions ? (
                      <>
                        Hide Options <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Show Options <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 👇 Only show options when toggled */}
              {showOptions && options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(opt)}
                      className="bg-green-100 hover:bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center border-t border-gray-200 p-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={() => handleSend()}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
