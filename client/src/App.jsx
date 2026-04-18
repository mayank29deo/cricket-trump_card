import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import QuizLobby from './pages/QuizLobby'
import QuizGame from './pages/QuizGame'
import HintQuizGame from './pages/HintQuizGame'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game/:roomCode" element={<Game />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/quiz" element={<QuizLobby />} />
      <Route path="/quiz/play/:roomCode" element={<QuizGame />} />
      <Route path="/hintquiz/play/:roomCode" element={<HintQuizGame />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
