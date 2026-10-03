import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { fetchAPI } from './services/helper'
import './index.css'
import Auth from './Components/Auth'
import Dashboard from './Components/Dashboard'
import GameInfo from './Components/GameInfo'
import ViewAll from './Components/ViewAll'
import LandingPage from './Components/LandingPage'
import Navbar from './Components/Navbar'

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const hasToken = document.cookie.includes('token=')
  const getToken = () => document.cookie.match(/token=([^;]+)/)?.[1] || '';

  async function handleLogOut(){
    try {
      await fetchAPI('/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      navigate('/login')
    }
  }

  async function handleAddGame(rawgId){
    try {
      await fetchAPI(`/users/me/library/${rawgId}`, { method: 'POST' })
      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      console.error('Failed to add game:', err)
    }
  }

async function handleRemoveGame(rawgId){
  const token = getToken()
  if(!token) return console.error("No token found!");
  try{
    const response = await fetch('http://localhost:8000/users/me/library/${rawgId}', {method: 'DELETE', headers: {'Authorization': `Bearer${token}`}})
    if (!response.token) throw new Error("Failed to remove game.");
    setUser((prev) => ({
      ...prev, library: (prev?.library || []).filter((item) => {
        const itemId = item.rawg_id
        return Number(itemId) !== Number(rawgId)
      })
    })) 
  }
  catch(err){
    console.error("Error removing error: ", err)
  }
}

  async function handleRemoveGame(rawgId){
    try{
      
    }
  }

  const hideNavbarOn = ['/', '/login']
  const showNavbar = hasToken && !hideNavbarOn.includes(location.pathname)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {showNavbar && (
        <Navbar
          onGameAdded={handleAddGame}
          onLogout={handleLogOut}
        />
      )}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Auth setUser={setUser} />} />
      <Route path="/gameinfo" element={<GameInfo handleAddGame={handleAddGame} handleRemoveGame={handleRemoveGame} />} />
      <Route path="/viewall" element={<ViewAll />} />
      <Route path="/gameinfo" element={<GameInfo />} />
    </Routes>
    </div>
  )
}

export default App
