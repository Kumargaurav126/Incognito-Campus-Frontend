const API_URL = "http://192.168.1.4:8080/api"; // your backend URL

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`);
  return res.json();
}

export async function getMessagesByRoomName(roomName) {
  const res = await fetch(`${API_URL}/messages/room/${roomName}`);
  return res.json();
}


export async function getMyCollege() {
//const res = await fetch(`${API_URL}/rooms`); 


}