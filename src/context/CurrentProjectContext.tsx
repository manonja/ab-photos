'use client'

import type React from 'react'
import { createContext, useContext, useState } from 'react'

type CurrentProjectContextType = {
  currentProjectId: string | null
  setCurrentProjectId: (id: string | null) => void
}

const CurrentProjectContext = createContext<CurrentProjectContextType>({
  currentProjectId: null,
  setCurrentProjectId: () => {},
})

export const useCurrentProject = () => useContext(CurrentProjectContext)

export function CurrentProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)

  return (
    <CurrentProjectContext.Provider value={{ currentProjectId, setCurrentProjectId }}>
      {children}
    </CurrentProjectContext.Provider>
  )
}
