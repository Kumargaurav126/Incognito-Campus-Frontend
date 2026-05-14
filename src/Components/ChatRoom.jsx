import React, { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { ChatContext } from "../Context/ChatContext";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import Navbar from "../Components/pages/Navbar"
import API_URL, { SUMMARISE_URL } from "../config";

export default function ChatRoom() {
  const { rooms, currentRoom, messages, currentRoomId, currentRoomDescription } = useContext(ChatContext);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentRoom) return (
    <div className="flex items-center justify-center h-full w-full bg-linear-to-br from-gray-50 to-blue-50 p-4">
      <div className="text-center p-6 md:p-8 rounded-xl bg-white shadow-lg border border-gray-100 max-w-sm w-full">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium text-base md:text-lg">Select a room to join the chat</p>
        <p className="text-gray-400 text-xs md:text-sm mt-2">Choose from the available rooms in the sidebar</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[60vh] md:h-full grow bg-linear-to-br from-white to-blue-50 p-3 md:p-6 shadow-lg overflow-hidden">
      
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-blue-500 p-1.5 md:p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 font-sans truncate max-w-[200px] sm:max-w-xs md:max-w-md">{currentRoom}</h2>
        </div>

        <div className="relative group shrink-0">
          <button
            id="aiIcon"
            className="text-1xl cursor-pointer bg-blue-400 p-1.5 md:p-2 rounded-xl hover:bg-blue-500 transition"
            onClick={handleSummarize}
          >
            <img src="https://static.thenounproject.com/png/1109634-200.png" className="h-3 md:h-4" alt="AI" />
          </button>
          <div className="absolute right-0 top-10 md:top-12 bg-white border border-gray-200 text-xs md:text-sm text-gray-700 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block z-10 whitespace-nowrap">
            Summarize
          </div>
        </div>
      </div>

      <div className="bg-blue-100 rounded-lg p-2 md:p-4 mb-2 shrink-0">
        <h2 className="font-medium text-xs md:text-sm text-blue-800 flex items-start md:items-center gap-1 md:gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 shrink-0 mt-0.5 md:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="flex flex-col md:flex-row md:gap-1 w-full">
            <span className="shrink-0 font-semibold md:font-medium">Description:</span>
            <span className="font-normal truncate md:whitespace-normal md:break-words text-[10px] md:text-sm">{currentRoomDescription}</span>
          </span>
        </h2>
      </div>

      <div className="grow overflow-auto mb-2 border border-gray-200 rounded-xl p-3 md:p-6 bg-white shadow-inner flex flex-col">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} className="shrink-0" />
      </div>

      <div className="shrink-0">
        <MessageInput />
      </div>

      {showSummaryModal && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-end md:items-center justify-end z-[60] transition-all">
          <div className="w-full md:max-w-md h-[70vh] md:h-full bg-white shadow-2xl border-t md:border-t-0 md:border-l border-blue-200 transform translate-y-0 md:translate-x-0 transition-transform duration-300 ease-out p-4 md:p-6 flex flex-col rounded-t-2xl md:rounded-none">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-lg md:text-xl font-semibold text-blue-700">Summary</h3>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-blue-500 hover:text-red-600 text-2xl md:text-3xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="text-sm md:text-base text-gray-700 overflow-y-auto whitespace-pre-wrap grow pb-4">
              {summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}