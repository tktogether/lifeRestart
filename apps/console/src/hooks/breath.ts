import { useState, useEffect } from 'react'

export function useBreath(interval = 1000) {
    const [breathing, setBreathing] = useState(false)

    useEffect(() => {
        const id = setInterval(() => {
            setBreathing(prev => !prev)
        }, interval)
        return () => clearInterval(id)
    }, [interval])

    return breathing
}
