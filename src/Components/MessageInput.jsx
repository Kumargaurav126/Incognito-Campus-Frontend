import React, { useState, useContext } from "react";
import { ChatContext } from "../Context/ChatContext";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useContext(ChatContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userData = {
      RoomName: "Anonymous",
      collegeSnapshot: userInfo.college,
      branchSnapshot: userInfo.branch,
      senderName: userInfo.displayName,
      senderId: userInfo.id,
    };

    sendMessage(text, userData);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border font-medium outline-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-300 transition min-w-0"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 px-4 md:px-5 py-2.5 text-white rounded-full hover:bg-blue-600 transition shrink-0 flex items-center gap-1.5 text-sm font-semibold"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
}
