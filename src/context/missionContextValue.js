import { createContext, useContext } from 'react'

export const MissionContext = createContext(null)

export function useMissionContext() {
  const ctx = useContext(MissionContext)
  if (!ctx) throw new Error('useMissionContext must be used inside MissionProvider')
  return ctx
}
