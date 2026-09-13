import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './index.css'
import Auth from './Components/Auth'
import Dashboard from './Components/Dashboard'
import GameInfo from './Components/GameInfo'
import ViewAll from './Components/ViewAll'
import LandingPage from './Components/LandingPage'

function App() {
  const [myGames] = useState([
    { id: 1, title: 'The Witcher 3', image: 'https://media.rawg.io/media/games/618/618c47b6478b0936d5f46d29840391a3.jpg', rating: 4.7 },
    { id: 2, title: 'Cyberpunk 2077', image: 'https://media.rawg.io/media/games/13a/13a52ca36e4820cbdc492d6e70412681.jpg', rating: 4.1 },
    { id: 3, title: 'Elden Ring', image: 'https://media.rawg.io/media/games/b29/b294fdd82079990209444a21f14d3204.jpg', rating: 4.8 },
    { id: 4, title: 'GTA V', image: 'https://media.rawg.io/media/games/20a/20af46e3d42b6a243e1662d30f56d0a7.jpg', rating: 4.5 },
    { id: 5, title: 'Red Dead Redemption 2', image: 'https://media.rawg.io/media/games/511/51182110f071f0ed8a8d3613f8f82500.jpg', rating: 4.7 },
    { id: 6, title: 'Hades', image: 'https://media.rawg.io/media/games/1f4/1f47a55aff90821333457f3d6139de61.jpg', rating: 4.6 },
  ]);
  
    // Mock Recommendations Data
  const becauseYouPlayed = [
    { id: 101, title: 'Dragon’s Dogma 2', image: 'https://media.rawg.io/media/games/082/08236551889e7969c17aee0b28610ce3.jpg', rating: 4.2 },
    { id: 102, title: 'Dark Souls III', image: 'https://media.rawg.io/media/games/da1/da15539e0132b32747b2610b650b2aa1.jpg', rating: 4.6 },
    { id: 103, title: 'Monster Hunter: World', image: 'https://media.rawg.io/media/games/a3f/a3f770a16ad06440e0cfd022b7a2d488.jpg', rating: 4.4 },
    { id: 104, title: 'Lords of the Fallen', image: 'https://media.rawg.io/media/games/5ec/5ecac9cb02db3d1791484e580e227e70.jpg', rating: 3.9 },
    { id: 105, title: 'Nioh 2', image: 'https://media.rawg.io/media/games/55e/55e4e7e60ed013b5d3a958a2d1d0f393.jpg', rating: 4.3 },
  ];

  const becauseYouLikeGenre = [
    { id: 201, title: 'Cities: Skylines II', image: 'https://media.rawg.io/media/games/226/2265538e121516f1f33f380628e93f35.jpg', rating: 3.8 },
    { id: 202, title: 'Frostpunk 2', image: 'https://media.rawg.io/media/games/d87/d87178a9c805a8f4c2e431525a816d3f.jpg', rating: 4.3 },
    { id: 203, title: 'Anno 1800', image: 'https://media.rawg.io/media/games/851/851892be141a0210f5e1865c36398b1c.jpg', rating: 4.5 },
    { id: 204, title: 'Manor Lords', image: 'https://media.rawg.io/media/games/f38/f38ec113a7c6f0e4b9538c227e79c3d4.jpg', rating: 4.4 },
    { id: 205, title: 'Civilization VI', image: 'https://media.rawg.io/media/games/22e/22e7039a4897f22312b9347d4e5f7267.jpg', rating: 4.5 },
  ];

  const [user, setUser] = useState(null)

  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard myGames={myGames} becauseYouLikeGenre={becauseYouLikeGenre} becauseYouPlayed={becauseYouPlayed} />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/gameinfo" element={<GameInfo />} />
      <Route path="/viewall" element={<ViewAll />} />
      <Route path="/gameinfo" element={<GameInfo />} />
    </Routes>
    </>
  )
}

export default App
