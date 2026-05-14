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
            <div className="flex items-center justify-center h-screen bg-blue-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg text-sm md:text-base text-center">
                    Please log in to see your college rooms.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-blue-100 w-full h-screen flex flex-col md:flex-row justify-between overflow-hidden">
            
            <div className="flex-1 w-full h-[60vh] md:h-screen overflow-hidden">
                <ChatRoom />
            </div>

            <aside className="w-full md:w-72 lg:w-80 bg-linear-to-b from-white to-black p-4 md:p-6 border-t md:border-t-0 md:border-l border-gray-900 h-[40vh] md:h-screen overflow-y-auto shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-lg flex flex-col z-10">
                <h2 className="font-sans font-bold mb-4 md:mb-8 text-xl md:text-2xl text-black border-b-2 border-gray-700 pb-2 tracking-wide shrink-0">
                    Chat Rooms
                </h2>
                <ul className="space-y-3 md:space-y-4 flex-1 overflow-y-auto pr-1">
                    {mycollege.map((room) => (
                        <li
                            key={room.id || room.roomName}
                            onClick={() => joinRoom(room)}
                            className={`cursor-pointer p-3 md:p-4 rounded-lg transition-all duration-300 ${
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
                            <div className="font-bold text-base md:text-lg mb-1">{room.roomName}</div>
                            {room.name && (
                                <div className={`text-xs md:text-sm font-semibold ${
                                    currentRoom === room.roomName ? "text-purple-100" : "text-black"
                                }`}>
                                    {room.name}
                                </div>
                            )}
                        </li>
                    ))}
                    {mycollege.length === 0 && (
                        <li className="font-bold text-blue-800 italic text-center py-4 bg-white bg-opacity-50 rounded-lg text-sm md:text-base">
                            No rooms available.
                        </li>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default Collagelist;