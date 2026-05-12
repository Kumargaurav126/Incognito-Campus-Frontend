import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../Context/ChatContext";
import ChatRoom from "../ChatRoom";
import axios from "axios";
import API_URL from "../../config";

const Collagelist = () => {
    const { joinRoom, currentRoom, mycollege, setmycollege, refreshTrigger } = useContext(ChatContext);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const id = userInfo?.id;

    useEffect(() => {
        if (!id) return;

        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/${id}/rooms`);
                
                const activeRooms = response.data.filter(room => !room.isDeleted && !room.deletedAt);
                setmycollege(activeRooms);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRooms();
    }, [id, setmycollege, refreshTrigger]);

    if (!userInfo) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-100">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    Please log in to see your college rooms.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-100 w-full h-screen flex justify-between">
            <ChatRoom />

            <aside className="w-74 bg-linear-to-b from-white to-black p-6 border-l border-gray-900 h-screen overflow-y-auto shadow-lg">
                <h2 className="font-sans font-bold mb-8 text-2xl text-black border-b-2 border-gray-700 pb-2 tracking-wide">
                    Chat Rooms
                </h2>
                <ul className="space-y-4">
                    {mycollege.map((room) => (
                        <li
                            key={room.id || room.roomName}
                            onClick={() => joinRoom(room)}
                            className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                                currentRoom === room.roomName
                                    ? "bg-purple-600 text-white shadow-md"
                                    : "bg-white bg-opacity-50 hover:bg-opacity-70 shadow-sm"
                            }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    joinRoom(room);
                                }
                            }}
                            aria-pressed={currentRoom === room.roomName}
                        >
                            <div className="font-bold text-lg mb-1">{room.roomName}</div>
                            {room.name && (
                                <div className={`text-sm font-semibold ${
                                    currentRoom === room.roomName ? "text-purple-100" : "text-black"
                                }`}>
                                    {room.name}
                                </div>
                            )}
                        </li>
                    ))}
                    {mycollege.length === 0 && (
                        <li className="font-bold text-blue-800 italic text-center py-4 bg-white bg-opacity-50 rounded-lg">
                            No rooms available.
                        </li>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default Collagelist;