import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function MessageList({ messages }) {




  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
 


  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className={`flex flex-col mb-4 ${userInfo.id === msg.senderId ? 'items-end' : 'items-start'}`}>
          <div className={"flex  items-center  mb-0.5 space-x-2 px-2 py-1 rounded-t-lg "}>
          <FaUser />
            <span className="font-medium  text-sm text-gray-700">{msg.senderName}</span>
            <span className="text-[10px] text-gray-600">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
          
          <div className={`mt-1 px-4 py-2 rounded-lg max-w-[50%] p-4 wrap-break-word ${
            userInfo.id === msg.senderId 
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
