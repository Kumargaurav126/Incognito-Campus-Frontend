import React, { useState, useContext } from "react";
import { ChatContext } from "../Context/ChatContext";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useContext(ChatContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // Your user info should be here, adjust as per your login/anonymous logic
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
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        placeholder="Type a message..."
        className="grow border font-semibold outline-none rounded px-3 py-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 px-4 text-white rounded hover:bg-blue-600">
        Send
      </button>
    </form>
  );
}
