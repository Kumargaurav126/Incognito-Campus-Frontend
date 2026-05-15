import React, { useState, useEffect, useRef } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { BsIncognito } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      setUserName(userInfo.displayName || userInfo.name || 'User');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setDropdownOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(e.target.value)}`;
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 md:px-6 py-3 shadow-md sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center space-x-2 shrink-0">
        <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <BsIncognito className="text-xl text-purple-700" />
          <span className="text-gray-800 hidden sm:inline">INCOGNITO</span>
          <span className="text-purple-700 font-bold hidden sm:inline">CAMPUS</span>
        </h1>
      </div>

      {/* Search — hidden on mobile, shown on md+ */}
      <div className="w-1/3 hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search something here..."
            className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-10 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onKeyDown={handleSearch}
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 111.397-1.398l3.85 3.85a1 1 0 01-1.415 1.415l-3.85-3.85zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
          </svg>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Mobile search icon */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 111.397-1.398l3.85 3.85a1 1 0 01-1.415 1.415l-3.85-3.85zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
          </svg>
        </button>

        {/* User dropdown or sign in */}
        {userName ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 rounded-full hover:bg-purple-50 transition duration-200 cursor-pointer"
            >
              <FaCircleUser className="w-7 h-7 md:w-8 md:h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-800 hidden sm:inline max-w-[100px] truncate">{userName}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  <FaCircleUser className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full transition duration-200"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile search bar dropdown */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md p-3 md:hidden z-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search channels, colleges..."
              className="w-full rounded-full bg-gray-100 py-2 pl-4 pr-10 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              onKeyDown={handleSearch}
              autoFocus
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 111.397-1.398l3.85 3.85a1 1 0 01-1.415 1.415l-3.85-3.85zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
