import React from "react";
import { FaUser } from "react-icons/fa";

export default function MessageList({ messages }) {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col mb-4 ${userInfo?.id === msg.senderId ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center mb-0.5 space-x-1 sm:space-x-2 px-1 sm:px-2 py-1 rounded-t-lg">
            <FaUser className="text-xs sm:text-sm text-gray-600" />
            <span className="font-medium text-xs sm:text-sm text-gray-700">{msg.senderName}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className={`mt-1 px-3 py-2 md:px-4 md:py-3 rounded-lg max-w-[85%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%] break-words text-sm md:text-base ${
            userInfo?.id === msg.senderId 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-200 text-gray-800 rounded-tl-none'
          }`}>
            {msg.content}
          </div>
        </div>
      ))}
    </>
  );
}