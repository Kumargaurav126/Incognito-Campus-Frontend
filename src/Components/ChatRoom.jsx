import React, { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { ChatContext } from "../Context/ChatContext";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import API_URL, { SUMMARISE_URL } from "../config";

export default function ChatRoom() {
  const { currentRoom, messages, currentRoomDescription } = useContext(ChatContext);
  const messagesEndRef = useRef();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = async () => {
    try {
      setSummarizing(true);
      const messageTexts = messages.map(m => `${m.senderName}: ${m.content}`);
      const response = await axios.post(`${SUMMARISE_URL}/summarise`, { messages: messageTexts });
      setSummary(response.data || "No summary available.");
      setShowSummaryModal(true);
    } catch (e) {
      setSummary("Failed to generate summary. Please try again.");
      setShowSummaryModal(true);
    } finally {
      setSummarizing(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentRoom) return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-6 md:p-8 rounded-xl bg-white shadow-lg border border-gray-100 mx-4">
        <div className="text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium text-base md:text-lg">Select a room to join the chat</p>
        <p className="text-gray-400 text-xs md:text-sm mt-2">Tap the Rooms button to choose a room</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50 p-3 md:p-6 shadow-lg overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="bg-blue-500 p-1.5 md:p-2 rounded-full shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 truncate">{currentRoom}</h2>
        </div>

        <div className="relative group shrink-0">
          <button
            className="cursor-pointer bg-blue-400 p-1.5 md:p-2 rounded-2xl hover:bg-blue-500 transition flex items-center gap-1"
            onClick={handleSummarize}
            disabled={summarizing}
          >
            {summarizing ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <img src="https://static.thenounproject.com/png/1109634-200.png" className="h-4 w-4" alt="AI" />
            )}
            <span className="text-white text-xs font-medium hidden sm:inline">Summarize</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-blue-100 rounded-lg p-3 mb-2 shrink-0">
        <p className="text-xs md:text-sm font-medium text-blue-800 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-normal">{currentRoomDescription}</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto mb-2 border border-gray-200 rounded-xl p-3 md:p-6 bg-white shadow-inner min-h-0">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput />

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-end md:items-center justify-end z-50">
          <div className="w-full md:max-w-md h-2/3 md:h-full bg-white shadow-2xl border-t md:border-l border-blue-200 rounded-t-2xl md:rounded-none p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-blue-700">AI Summary</h3>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-blue-500 hover:text-red-600 text-3xl font-bold cursor-pointer leading-none"
              >
                &times;
              </button>
            </div>
            <div className="text-gray-700 overflow-y-auto whitespace-pre-wrap flex-1 text-sm md:text-base">
              {summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
