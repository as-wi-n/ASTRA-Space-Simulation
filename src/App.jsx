import { useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import GamePage from './pages/GamePage.jsx'
import { useMission } from './hooks/useMission.js'

const gamePaths = new Set(['/dashboard', '/results', '/learn', '/about'])

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, startMission, clearMission } = useMission()
  const isGame = gamePaths.has(location.pathname)

  const beginMission = (missionData) => {
    const destinationId = (missionData?.destination || 'Moon').toLowerCase()
    startMission(destinationId, missionData?.astronautName || 'Astronaut', missionData?.difficulty)
    navigate('/dashboard')
  }

  if (location.pathname === '/') {
    return (
      <div className="min-h-screen bg-[#080807] text-slate-100">
        <HomePage onStartMission={beginMission} />
      </div>
    )
  }

  if (isGame) {
    return (
      <GamePage
        astronautName={state?.astronautName ?? 'Astronaut'}
        destination={state?.missionId === 'mars' ? 'Mars' : 'Moon'}
        onExit={() => {
          clearMission()
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#080807] text-slate-100">
      <HomePage onStartMission={beginMission} />
    </div>
  )
}
