import { useEffect, useMemo, useState } from 'react'
import { advanceDay, createMissionState, repairEquipment, resolveEmergency, restartMission, sendOnEva, sendRoverSurvey, toggleEquipment, toggleOptionalLoads, abortRoverMission, setCrewTask, askEarth } from '../simulation/missionEngine'
import { normalizeLoadedState } from './normalizeMissionState'
import { MissionContext } from './missionContextValue'

const STORAGE_KEY = 'astra-mission-state-v2'

export function MissionProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return normalizeLoadedState(JSON.parse(raw))
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage errors (quota / privacy mode)
    }
  }, [state])

  const api = useMemo(() => ({
    state,
    hasMission: !!state,
    startMission: (missionId, astronautName, difficulty) => setState(createMissionState(missionId, astronautName, difficulty)),
    nextDay: () => setState((s) => (s ? advanceDay(s) : s)),
    chooseEmergency: (choiceId) => setState((s) => (s ? resolveEmergency(s, choiceId) : s)),
    toggleEquipment: (id) => setState((s) => (s ? toggleEquipment(s, id) : s)),
    toggleOptionalLoads: () => setState((s) => (s ? toggleOptionalLoads(s) : s)),
    repairEquipment: (id) => setState((s) => (s ? repairEquipment(s, id) : s)),
    sendRoverSurvey: (actionKey) => setState((s) => (s ? sendRoverSurvey(s, actionKey) : s)),
    sendOnEva: (crewId, actionKey) => setState((s) => (s ? sendOnEva(s, crewId, actionKey) : s)),
    abortRoverMission: () => setState((s) => (s ? abortRoverMission(s) : s)),
    setCrewTask: (crewId, task) => setState((s) => (s ? setCrewTask(s, crewId, task) : s)),
    askEarth: () => setState((s) => (s ? askEarth(s) : s)),
    restart: () => setState((s) => (s ? restartMission(s) : s)),
    clearMission: () => setState(null),
  }), [state])

  return <MissionContext.Provider value={api}>{children}</MissionContext.Provider>
}
