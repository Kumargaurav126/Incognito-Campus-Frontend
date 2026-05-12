import API_URL from "../config";

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`);
  return res.json();
}

export async function getMessagesByRoomName(roomName) {
  const res = await fetch(`${API_URL}/messages/room/${roomName}`);
  return res.json();
}

export async function getMyCollege() {
  // const res = await fetch(`${API_URL}/rooms`); 
}