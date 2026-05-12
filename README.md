# 🕵️‍♂️ IncognitoCampus

**IncognitoCampus** is an anonymous, real-time chat platform designed for college students to engage in open and honest conversations without revealing their identity. The system uses room-based grouping by campus and branch, real-time WebSocket messaging, and auto-clearing messages to ensure privacy and security.

---

## 🚀 Features

- 🎭 **Anonymous Usernames**: Automatically generated at registration, no personal info required.
- 🏫 **Room-Based Architecture**: Join college- and branch-specific chat rooms.
- 💬 **Real-Time Messaging**: Built with WebSocket for instant communication.
- ⏳ **Auto-Deleting Messages**: Messages are cleared after 24 hours to maintain privacy.
- 🔍 **Smart Room Search**: Easily find and join your campus chat room.
- 🧠 **Upcoming**: AI-powered summarizer to highlight key points from long conversations.

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Spring Boot, WebSocket  
- **Database**: MongoDB  

---

## 📂 Project Structure

### Backend (`/backend`)
- REST APIs for user, room, and message management
- WebSocket configuration for real-time messaging
- MongoDB for message and room data storage

### Frontend (`/frontend`)
- React components for chat UI
- Room search and routing
- WebSocket integration for live updates

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- MongoDB
- Maven

### 🖥️ Frontend Setup

``bash
    cd frontend``
    
    npm install
    
    npm start

### 🔙 Backend Setup

``bash
    cd backend``
    
    mvn clean install
    
    java -jar target/incognito-campus.jar

