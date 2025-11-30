import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  initChatSocket,
  joinChatRoom,
  leaveChatRoom,
  sendMessageSocket,
} from "../socket/chatSocket";
import { fetchChat, receiveSocketMessage, setCurrentRoom } from "../redux/chatSlice";

function ChatPage() {
  const { shopOrderId } = useParams();
  const dispatch = useDispatch();
  const { messages, participants, currentRoom } = useSelector((state) => state.chat);
  const { userData } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    initChatSocket();
    dispatch(setCurrentRoom(shopOrderId));
    joinChatRoom(shopOrderId);

    return () => leaveChatRoom(shopOrderId);
  }, [shopOrderId, dispatch]);

  useEffect(() => {
    if (shopOrderId) dispatch(fetchChat(shopOrderId));
  }, [shopOrderId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const text = input.trim();
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI
    dispatch(
      receiveSocketMessage({
        _id: tempId,
        tempId,
        senderId: userData._id,
        sender: userData.fullName,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).toUpperCase(),
        shopOrderId,
      })
    );

    setInput("");

    sendMessageSocket({ shopOrderId, text, tempId });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-3 bg-white border-b">
        <h2 className="font-bold text-lg">Order Group Chat</h2>
        <p className="text-xs text-gray-500">Customer • Owner • Delivery Boy</p>
      </div>

      <div className="p-3 bg-white border-b">
        <p className="font-semibold">Participants</p>
        {participants?.map((p, i) => (
          <p key={i} className="text-sm">
            {p.role}: {p.name}
          </p>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((m) => {
          const mine = String(m.senderId) === String(userData._id);
          return (
            <div
              key={m._id}
              className={`p-3 rounded-xl shadow max-w-[70%] ${
                mine ? "ml-auto bg-orange-500 text-white" : "bg-white text-gray-800"
              }`}
            >
              <p className="font-bold">{m.sender}</p>
              <p>{m.text}</p>
              <p className="text-[10px] opacity-70 mt-1">{m.time}</p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 bg-white flex gap-2 border-t">
        <input
          className="flex-1 border p-2 rounded-xl"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-orange-500 text-white rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
