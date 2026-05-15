import React from "react";
import ChatRoom from "./Components/ChatRoom";
import Navbar from "./Components/pages/Navbar";
import VerticalNavbar from "./Components/pages/VerticalNavbar";
import Home from "./Components/pages/Home";
import Collagelist from "./Components/pages/Collagelist";
import { Routes, Route } from "react-router-dom";
import Login from "./Components/pages/Login";
import Channels from "./Components/pages/Channels";
import Search from "./Components/pages/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  try {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <ToastContainer position="top-center" />

        <div className="flex flex-1">
          <VerticalNavbar />
          <div className="flex-1 overflow-auto pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mycollage" element={<Collagelist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering App:", error);
    return <div>Something went wrong. Please check the console for details.</div>;
  }
}
