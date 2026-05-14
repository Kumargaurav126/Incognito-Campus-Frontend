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
    <form onSubmit={handleSubmit} className="flex space-x-2 w-full">
      <input
        type="text"
        placeholder="Type a message..."
        className="grow border font-semibold outline-none rounded px-3 py-2 md:px-4 md:py-3 text-sm md:text-base transition-all"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 px-4 py-2 md:px-6 md:py-3 text-sm md:text-base text-white rounded hover:bg-blue-600 transition-colors shrink-0 font-medium">
        Send
      </button>
    </form>
  );
}