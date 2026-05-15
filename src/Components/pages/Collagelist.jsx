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
                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[60%]">
                        {currentRoom || "Select a room"}
                    </span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        Rooms
                    </button>
                </div>
                <ChatRoom />
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed md:static top-0 right-0 h-full z-40
                w-72 md:w-64 lg:w-72
                bg-gradient-to-b from-white to-purple-100
                border-l border-purple-200 shadow-lg
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                flex flex-col
                pb-14 md:pb-0
            `}>
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-purple-200">
                    <h2 className="font-bold text-xl text-purple-900 tracking-wide">Chat Rooms</h2>
                    <button
                        className="md:hidden text-gray-500 hover:text-gray-800 text-2xl leading-none"
                        onClick={() => setSidebarOpen(false)}
                    >
                        &times;
                    </button>
                </div>

                <ul className="space-y-2 p-4 overflow-y-auto flex-1">
                    {mycollege.map((room) => (
                        <li
                            key={room.id || room.roomName}
                            onClick={() => { joinRoom(room); setSidebarOpen(false); }}
                            className={`cursor-pointer p-3 rounded-xl transition-all duration-200 ${
                                currentRoom === room.name
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "bg-white hover:bg-purple-50 shadow-sm text-gray-800 border border-purple-100"
                            }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    joinRoom(room);
                                    setSidebarOpen(false);
                                }
                            }}
                            aria-pressed={currentRoom === room.name}
                        >
                            <div className="font-semibold text-sm mb-0.5">{room.name}</div>
                            {room.college && (
                                <div className={`text-xs ${
                                    currentRoom === room.name ? "text-purple-100" : "text-gray-500"
                                }`}>
                                    {room.college}
                                    {room.branch ? ` · ${room.branch}` : ''}
                                </div>
                            )}
                        </li>
                    ))}
                    {mycollege.length === 0 && (
                        <li className="text-gray-400 italic text-center py-8 text-sm">
                            No rooms available.<br />
                            <span className="text-xs">Subscribe to channels first.</span>
                        </li>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default Collagelist;
