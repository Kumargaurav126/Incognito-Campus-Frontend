import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_URL from '../../config';

const Search = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');

  console.log(searchQuery)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_URL}/rooms/search?query=${searchQuery}`);
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    if (searchQuery) {
      fetchRooms();
    }
  }, [searchQuery]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const id = userInfo.id;

  const subscribehandler = async (idx) => {
    try {
      const res = await axios.post(`${API_URL}/users/${id}/follow/${idx}`);
      toast.success("Subscribed successfully");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-100 w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Search Results for: {searchQuery}</h1>
      
      {rooms.length === 0 ? (
        <p className="text-xl text-gray-600">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h2>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex justify-between mt-4">
                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">{room.college}</span>
                <button
                  onClick={() => subscribehandler(room.id)}
                  className="px-4 py-1.5 text-sm bg-purple-200 text-purple-800 rounded-full hover:bg-purple-300 transition duration-200 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
