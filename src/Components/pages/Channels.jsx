import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../../Context/ChatContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_URL from "../../config";

const Channels = () => {
    const { rooms, setRooms, mycollege, setmycollege } = useContext(ChatContext);
    const [loadingId, setLoadingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [subscribedIds, setSubscribedIds] = useState(new Set());

    const [form, setForm] = useState({
        name: '',
        description: '',
        college: '',
        branch: '',
    });
    const [formError, setFormError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userId = userInfo?.id;

    // Fetch already-subscribed room IDs on mount
    useEffect(() => {
        if (!userId) return;
        axios.get(`${API_URL}/users/${userId}/rooms`)
            .then((res) => {
                const ids = new Set(res.data.map((r) => r.id));
                setSubscribedIds(ids);
            })
            .catch(console.error);
    }, [userId]);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError('');
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error("Please login to create a channel");
            return;
        }
        if (!form.name.trim() || !form.college.trim() || !form.branch.trim()) {
            setFormError('Name, College, and Branch are required.');
            return;
        }

        setCreating(true);
        try {
            const response = await axios.post(`${API_URL}/rooms`, {
                ...form,
                createdBy: userId,
            });
            toast.success("Channel created successfully!");
            if (setRooms) {
                setRooms((prev) => [...prev, response.data]);
            }
            setForm({ name: '', description: '', college: '', branch: '' });
            setShowModal(false);
        } catch (error) {
            console.error(error);
            setFormError(error.response?.data?.message || 'Failed to create channel. Try again.');
        } finally {
            setCreating(false);
        }
    };

    const subscribeHandler = async (roomId) => {
        if (!userId) { toast.error("Please login to subscribe"); return; }
        setLoadingId(roomId);
        try {
            await axios.post(`${API_URL}/users/${userId}/follow/${roomId}`);
            setSubscribedIds((prev) => new Set([...prev, roomId]));
            
            // Add room to mycollege so sidebar updates instantly
            const subscribedRoom = rooms.find((r) => r.id === roomId);
            if (subscribedRoom && !mycollege.find((r) => r.id === roomId)) {
                setmycollege((prev) => [...prev, subscribedRoom]);
            }
            
            toast.success("Subscribed successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to subscribe");
        } finally {
            setLoadingId(null);
        }
    };

    const unsubscribeHandler = async (roomId) => {
        if (!userId) return;
        setLoadingId(roomId);
        try {
            await axios.delete(`${API_URL}/users/${userId}/unfollow/${roomId}`);
            setSubscribedIds((prev) => { const u = new Set(prev); u.delete(roomId); return u; });
            
            // Remove room from mycollege so sidebar updates instantly
            setmycollege((prev) => prev.filter((r) => r.id !== roomId));
            
            toast.success("Unsubscribed successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unsubscribe");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="bg-gray-100 w-full min-h-screen p-8">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-purple-800">Available Channels</h1>
                    <p className="text-sm text-gray-500 mt-1">{rooms?.length || 0} channels available</p>
                </div>
                <button
                    onClick={() => {
                        if (!userId) {
                            toast.error("Please login to create a channel");
                            return;
                        }
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-purple-300 transition-all duration-200 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Channel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms && rooms.map((room) => {
                    const isSubscribed = subscribedIds.has(room.id);
                    const isLoading = loadingId === room.id;

                    return (
                        <div key={room.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-lg font-bold text-gray-800">{room.name}</h2>
                                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                                    {room.college}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-1">{room.description}</p>
                            {room.branch && (
                                <span className="inline-block text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full mb-4">
                                    {room.branch}
                                </span>
                            )}

                            <div className="flex items-center justify-between mt-4">
                                {isSubscribed && (
                                    <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Subscribed
                                    </span>
                                )}
                                <div className={`${isSubscribed ? '' : 'ml-auto'}`}>
                                    {isSubscribed ? (
                                        <button
                                            onClick={() => unsubscribeHandler(room.id)}
                                            disabled={isLoading}
                                            className={`px-4 py-1.5 text-sm rounded-full font-semibold transition-all duration-200 ${
                                                isLoading
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {isLoading ? "..." : "Unsubscribe"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => subscribeHandler(room.id)}
                                            disabled={isLoading}
                                            className={`px-4 py-1.5 text-sm rounded-full font-semibold transition-all duration-200 ${
                                                isLoading
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                                            }`}
                                        >
                                            {isLoading ? "Subscribing..." : "Subscribe"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {(!rooms || rooms.length === 0) && (
                    <div className="col-span-3 text-center py-20 text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <p className="font-medium">No channels yet</p>
                        <p className="text-sm mt-1">Be the first to create one!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-linear-to-r from-purple-700 to-indigo-700 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">Create a Channel</h2>
                                    <p className="text-purple-200 text-xs mt-0.5">Set up a new chat room for your college</p>
                                </div>
                                <button
                                    onClick={() => { setShowModal(false); setFormError(''); }}
                                    className="text-white/60 hover:text-white text-2xl font-bold transition cursor-pointer leading-none"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateChannel} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                                    Channel Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    placeholder="e.g. CSE Placement 2025"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                                        College <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={form.college}
                                        onChange={handleFormChange}
                                        placeholder="IIT Bombay"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                                        Branch <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={form.branch}
                                        onChange={handleFormChange}
                                        placeholder="CSE / ECE"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="What's this channel about?"
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
                                />
                            </div>

                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2.5">
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setFormError(''); }}
                                    className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : 'Create Channel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Channels;
