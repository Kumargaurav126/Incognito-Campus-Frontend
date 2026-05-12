import React, { createContext, useState, useEffect, useRef } from "react";
import { getRooms, getMessagesByRoomName, getMyCollege } from "../Services/Api";
import { connectWebSocket, sendMessageWS, subscribeToRoom } from "../Services/websocket";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const[currentRoomDescription, setCurrentRoomDescription] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mycollege, setmycollege] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    getRooms().then(setRooms).catch(console.error);
    // getMyCollege().then(setmycollege).catch(console.error);

    // getMyCollege()
    // .then((res) => {
    //   console.log("Response from getMyCollege():", res);
    //   setmycollege(res);
    // })
    // .catch((error) => {
    //   console.error("Error fetching college info:", error);
    // });

  
  // Connect WebSocket once
    ws.current = connectWebSocket();

    return () => {
      if (ws.current && ws.current.deactivate) {
        ws.current.deactivate(); // Proper STOMP disconnect
      }
    };
  }, []);

  const joinRoom = async (room) => {

    console.log(JSON.stringify(room), "ppppppp");
    
   
    setCurrentRoom(room.name);
    setCurrentRoomId(room.id);
    setCurrentRoomDescription(room.description);
  
    // Load previous messages from backend
    const history = await getMessagesByRoomName(room.name);
    setMessages(history);

    // Subscribe to room on websocket
    subscribeToRoom(ws.current, room.name, (newMessage) => {

      
      setMessages((prev) => [...prev, newMessage]);
    });
  };

  const sendMessage = (content, userInfo) => {
    console.log(userInfo);
    console.log(content);
    
    if (!currentRoom) return;
    sendMessageWS(ws.current, currentRoom, {
      ...userInfo,
      content,
      roomId: rooms.id,
      roomName: currentRoom,
    });
  };

  return (
    <ChatContext.Provider value={{ rooms, currentRoom, joinRoom, messages, sendMessage, mycollege, setmycollege, currentRoomId, currentRoomDescription }}>
      {children}
    </ChatContext.Provider>
  );
};
