import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../Context/ChatContext";
import ChatRoom from "../ChatRoom";
import axios from "axios";
import API_URL from "../../config";

const Collagelist = () => {
    const { joinRoom, currentRoom, mycollege, setmycollege } = useContext(ChatContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const id = userInfo?.id;

    useEffect(() => {
        if (!id) return;
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/${id}/rooms`);
                setmycollege(response.data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, [id, setmycollege]);

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-100 w-full">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    Please log in to see your college rooms.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex overflow-hidden relative bg-blue-50 pb-14 md:pb-0">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Chat area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile header with room list toggle */}
                <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">
                        {currentRoom || "Select a room"}
                    </span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Rooms
                    </button>
                </div>
                <ChatRoom />
            </div>

            {/* Sidebar — desktop always visible, mobile slide-in */}
            <aside className={`
                fixed md:static top-0 right-0 h-full z-40
                w-64 md:w-64 lg:w-72
                bg-gradient-to-b from-white to-gray-900
                border-l border-gray-900 shadow-lg
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                flex flex-col
                pb-14 md:pb-0
            `}>
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-700">
                    <h2 className="font-bold text-xl text-white tracking-wide">Chat Rooms</h2>
                    <button
                        className="md:hidden text-white/60 hover:text-white text-2xl leading-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        &times;
                    </button>
                </div>

                <ul className="space-y-3 p-4 overflow-y-auto flex-1">
                    {mycollege.map((room) => (
                        <li
                            key={room.id || room.roomName}
                            onClick={() => { joinRoom(room); setSidebarOpen(false); }}
                            className={`cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                                currentRoom === room.name
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "bg-white bg-opacity-20 hover:bg-opacity-30 shadow-sm text-white"
                            }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { joinRoom(room); setSidebarOpen(false); } }}
                        >
                            <div className="font-bold text-sm mb-0.5">{room.name}</div>
                            {room.college && (
                                <div className={`text-xs ${currentRoom === room.name ? "text-purple-100" : "text-gray-300"}`}>
                                    {room.college}
                                </div>
                            )}
                        </li>
                    ))}
                    {mycollege.length === 0 && (
                        <li className="text-gray-400 italic text-center py-6 text-sm">
                            No rooms available. Subscribe to channels first.
                        </li>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default Collagelist;
