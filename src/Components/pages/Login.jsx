import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BsIncognito } from "react-icons/bs"
import API_URL from "../../config";

const Login = () => {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const navigate = useNavigate()

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regCollege, setRegCollege] = useState('')
  const [regBranch, setRegBranch] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: loginEmail,
        password: loginPassword,
      })
      if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data))
        navigate('/')
        window.location.reload()
      } else {
        setLoginError('Login failed. Please check your credentials.')
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    setRegSuccess('')
    setRegLoading(true)
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: regName,
        email: regEmail,
        password: regPassword,
        college: regCollege,
        branch: regBranch,
      })
      if (response.data) {
        setRegSuccess('Account created! You can now log in.')
        setRegName('')
        setRegEmail('')
        setRegPassword('')
        setRegCollege('')
        setRegBranch('')
        setTimeout(() => setTab('login'), 1500)
      }
    } catch (error) {
      setRegError(error.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-purple-950 via-indigo-900 to-slate-900 p-4 relative overflow-hidden">

      {/* Background decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-purple-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mb-3 shadow-lg">
            <BsIncognito className="text-4xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">INCOGNITO CAMPUS</h1>
          <p className="text-purple-300 text-xs mt-1 tracking-widest uppercase">Anonymous · Real-time · Campus</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => { setTab('login'); setLoginError('') }}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-white/15 text-white border-b-2 border-purple-400'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setRegError(''); setRegSuccess('') }}
              className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-white/15 text-white border-b-2 border-purple-400'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">

            {/* LOGIN FORM */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@college.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>

                {loginError && (
                  <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-xs rounded-lg px-4 py-2.5">
                    {loginError}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-purple-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-purple-500" />
                    Remember me
                  </label>
                  <a href="#" className="hover:text-white transition">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-purple-500/30 hover:shadow-xl"
                >
                  {loginLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </button>

                <p className="text-center text-xs text-white/40 pt-1">
                  No account?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-purple-300 hover:text-white transition font-medium">
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@college.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 8 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">College</label>
                      <input
                        type="text"
                        required
                        placeholder="IIT Bombay"
                        value={regCollege}
                        onChange={(e) => setRegCollege(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1.5 uppercase tracking-widest">Branch</label>
                      <input
                        type="text"
                        required
                        placeholder="CSE"
                        value={regBranch}
                        onChange={(e) => setRegBranch(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {regError && (
                  <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-xs rounded-lg px-4 py-2.5">
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="bg-green-500/20 border border-green-400/40 text-green-200 text-xs rounded-lg px-4 py-2.5">
                    {regSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-purple-500/30 hover:shadow-xl"
                >
                  {regLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>

                <p className="text-center text-xs text-white/40 pt-1">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-purple-300 hover:text-white transition font-medium">
                    Sign in
                  </button>
                </p>
              </form>
            )}

          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">© 2026 INCOGNITO Campus · Anonymous by design</p>
      </div>
    </div>
  )
}

export default Login
