import React, { useContext, useRef, useEffect,useState } from "react";
import axios from "axios";
import { ChatContext } from "../Context/ChatContext";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import Navbar from "../Components/pages/Navbar"
import API_URL, { SUMMARISE_URL } from "../config";

export default function ChatRoom() {
  const {rooms, currentRoom, messages, currentRoomId, currentRoomDescription} = useContext(ChatContext);
  const messagesEndRef = useRef();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
        const messageTexts = messages.map(m => `${m.senderName}: ${m.content}`);
        const response = await axios.post(`${SUMMARISE_URL}/summarise`, { messages: messageTexts });
        setSummary(response.data || "No summary available.");
        setShowSummaryModal(true);
    } catch (e) {
        console.log(e.message);
        setSummary("Failed to generate summary. Please try again.");
        setShowSummaryModal(true);
    }
};

  // Scroll to bottom when messages update
  useEffect(() => {
    
    
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  if (!currentRoom) return (
    <div className="flex items-center justify-center h-full w-full bg-linear-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 rounded-xl bg-white shadow-lg border border-gray-100">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium text-lg">Select a room to join the chat</p>
        <p className="text-gray-400 text-sm mt-2">Choose from the available rooms in the sidebar</p>
      </div>
    </div>
  );

  return (
 
    <div className="flex flex-col grow bg-linear-to-br from-white to-blue-50 p-6 shadow-lg">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-sans">{currentRoom}</h2>
        </div>

        <div className="relative group">
          <button
            id="aiIcon"
            className="text-1xl cursor-pointer bg-blue-400 p-2 rounded-2xl hover:bg-blue-500 transition"
            onClick={handleSummarize}
          >
            <img src="https://static.thenounproject.com/png/1109634-200.png" className="h-4" alt="AI" />
          </button>
          <div className="absolute right-0 top-12 bg-white border border-gray-200 text-sm text-gray-700 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Summarize
          </div>
        </div>
      </div>

      {/* Room Description */}
      <div className="bg-blue-100 rounded-lg p-4 mb-2">
        <h2 className="font-medium text-blue-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Description: <span className="font-normal">{currentRoomDescription}</span>
        </h2>
      </div>

      {/* Chat Area */}
      <div className="grow overflow-auto mb-2 border border-gray-200 rounded-xl p-6 bg-white shadow-inner">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />

      {/* Summary Modal */}
      {showSummaryModal && (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-end z-50 transition-all">
    <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-blue-200 transform translate-x-0 transition-transform duration-300 ease-out p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-blue-700">Summary</h3>
        <button
          onClick={() => setShowSummaryModal(false)}
          className="text-blue-500  hover:text-red-600 text-3xl font-bold cursor-pointer "
        >
          &times;
        </button>
      </div>
      <div className="text-gray-700 overflow-y-auto whitespace-pre-wrap grow">
        {summary}
      </div>
    </div>
  </div>
)}
    </div>
   
  );
}
