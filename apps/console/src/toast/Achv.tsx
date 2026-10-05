import { useEffect, useState } from 'react'
import { Box, Achievement } from '@/components'

type AchvToast = (id: number) => void
const L = new Set<AchvToast>()
const on = (fn: AchvToast) => L.add(fn)
const off = (fn: AchvToast) => L.delete(fn)

export function ToastAchvContainer() {
    const [achievements, setAchievements] = useState<number[]>([])
    useEffect(() => {
        const handleAdd = (id: number) => {
            setAchievements(prev => [...prev, id])
            setTimeout(() => {
                setAchievements(prev => prev.filter(t => t !== id))
            }, 4000)
        }

        on(handleAdd)
        return () => {
            off(handleAdd)
        }
    }, [])

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            flexDirection="column"
            alignItems="center"
        >
            {achievements.map(id => (
                <Achievement key={id} id={id} />
            ))}
        </Box>
    )
}
export default ToastAchvContainer

export function toastAchvs(achievements: number[]) {
    if (achievements.length === 0) return
    for (const id of achievements) for (const fn of L) fn(id)
}
