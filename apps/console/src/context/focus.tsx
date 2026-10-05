import { createContext, useContext, useState, type ReactNode } from 'react'

type FocusScene = 'main' | 'modal' | 'menu'

interface FocusContextType {
    currentFocus: FocusScene
    setFocus: (scene: FocusScene) => void
    isFocused: (scene: FocusScene) => boolean
}

const FocusContext = createContext<FocusContextType | undefined>(undefined)

export const FocusProvider = ({ children }: { children: ReactNode }) => {
    const [currentFocus, setFocus] = useState<FocusScene>('main')
    const isFocused = (scene: FocusScene) => currentFocus === scene
    return (
        <FocusContext.Provider value={{ currentFocus, setFocus, isFocused }}>
            {children}
        </FocusContext.Provider>
    )
}

export const useAppFocus = () => {
    const context = useContext(FocusContext)
    if (!context) {
        throw new Error('useAppFocus 必须在 FocusProvider 内部使用')
    }
    return context
}
