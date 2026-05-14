import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome } from "react-icons/fa";

const VerticalNavbar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const ProtectedLink = ({ to, children }) => {
    if (userInfo && userInfo.id) {
      return <Link to={to} className="flex flex-col md:flex-row items-center justify-center md:justify-start px-2 md:px-3 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition w-full md:w-auto">{children}</Link>
    } else {
      return <Link to="/login" className="flex flex-col md:flex-row items-center justify-center md:justify-start px-2 md:px-3 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition w-full md:w-auto">{children}</Link>
    }
  }

  return (
    <div className='fixed bottom-0 left-0 w-full md:static md:h-screen bg-linear-to-b from-purple-100 to-purple-300 md:from-white md:to-purple-300 md:w-64 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-md z-50 flex'>
      <aside className="w-full md:w-64 h-auto md:h-fit p-2 md:p-6 flex flex-row md:flex-col">
        <nav className="flex flex-row md:flex-col w-full justify-around md:justify-start md:space-y-4 text-gray-800">
          <Link to={"/"} className="flex flex-col md:flex-row items-center justify-center md:justify-start px-2 md:px-3 py-2 md:gap-4 rounded-lg hover:bg-purple-200 hover:text-purple-800 transition w-full md:w-auto">
            <FaHome className='text-xl md:text-xl text-purple-700 mb-1 md:mb-0' />
            <span className="text-[10px] md:text-base font-medium">Home</span>
          </Link>

          <ProtectedLink to="/mycollage">
            <svg className="w-5 h-5 md:mr-3 text-purple-700 mb-1 md:mb-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"/></svg>
            <span className="text-[10px] md:text-base font-medium whitespace-nowrap">My College</span>
          </ProtectedLink>

          <ProtectedLink to="/channels">
            <svg className="w-5 h-5 md:mr-3 text-purple-700 mb-1 md:mb-0" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3h12a1 1 0 011 1v2H3V4a1 1 0 011-1zm-1 5h14v2H3V8zm0 4h14v2H3v-2z"/></svg>
            <span className="text-[10px] md:text-base font-medium">Channels</span>
          </ProtectedLink>
        </nav>
      </aside>
    </div>
  )
}

export default VerticalNavbar