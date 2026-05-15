import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaUserCircle } from "react-icons/fa";
import { BsIncognito } from "react-icons/bs";

const VerticalNavbar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const ProtectedLink = ({ to, children, onClick }) => {
    const isActive = location.pathname === to;
    const base = `flex items-center px-3 py-2.5 rounded-lg transition gap-2 ${isActive ? 'bg-purple-200 text-purple-800 font-semibold' : 'hover:bg-purple-100 hover:text-purple-700'}`;
    if (userInfo && userInfo.id) {
      return <Link to={to} className={base} onClick={onClick}>{children}</Link>;
    }
    return <Link to="/login" className={base} onClick={onClick}>{children}</Link>;
  };

  const NavLinks = ({ onClick }) => (
    <>
      <Link
        to="/"
        onClick={onClick}
        className={`flex items-center px-3 py-2.5 gap-2 rounded-lg transition ${location.pathname === '/' ? 'bg-purple-200 text-purple-800 font-semibold' : 'hover:bg-purple-200 hover:text-purple-800'}`}
      >
        <FaHome className='text-xl text-purple-700' />
        <span className="font-medium">Home</span>
      </Link>

      <ProtectedLink to="/mycollage" onClick={onClick}>
        <svg className="w-5 h-5 text-purple-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
        </svg>
        <span className="font-medium">My College</span>
      </ProtectedLink>

      <ProtectedLink to="/channels" onClick={onClick}>
        <svg className="w-5 h-5 text-purple-700 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3h12a1 1 0 011 1v2H3V4a1 1 0 011-1zm-1 5h14v2H3V8zm0 4h14v2H3v-2z"/>
        </svg>
        <span className="font-medium">Channels</span>
      </ProtectedLink>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className='hidden md:flex h-screen bg-gradient-to-b from-white to-purple-300 w-56 lg:w-64 shadow-md shrink-0 sticky top-0'>
        <aside className="w-full h-fit p-4 flex flex-col">
          <nav className="flex flex-col space-y-2 text-gray-800">
            <NavLinks />
          </nav>
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="flex items-center justify-around py-2">
          <Link to="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === '/' ? 'text-purple-700' : 'text-gray-500'}`}>
            <FaHome className="text-xl" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link to={userInfo ? "/mycollage" : "/login"} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === '/mycollage' ? 'text-purple-700' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/>
            </svg>
            <span className="text-[10px] font-medium">My College</span>
          </Link>

          <Link to={userInfo ? "/channels" : "/login"} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${location.pathname === '/channels' ? 'text-purple-700' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3h12a1 1 0 011 1v2H3V4a1 1 0 011-1zm-1 5h14v2H3V8zm0 4h14v2H3v-2z"/>
            </svg>
            <span className="text-[10px] font-medium">Channels</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerticalNavbar;
