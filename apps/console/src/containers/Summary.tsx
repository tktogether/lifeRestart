import { useEffect, useRef } from 'react'
import { usePicked, useEnd, useProfile, useIsClassic } from '@remake/hooks'
import { useSelect } from '@/hooks/select'
import { useAppFocus } from '@/context/focus'
import { useEndJudge } from '@/hooks/judge'
import { useInput } from 'ink'
import { properties, judgeDisplay } from '@remake/data/etc/display'
import { Box, Text } from '@/components'
import { toastAchvs } from '@/toast'
// import { toastAchvs, toastMsg } from '@/toast'
import { grades } from '@/style'
import Talent from '@/components/Talent'

function Judges() {
    const judges = useEndJudge()
    return (
        <Box gap={1}>
            {judges.map(([key, { value, grade, level }]) => {
                const color = grades[grade]
                return (
                    <Box
                        key={key}
                        flexDirection="column"
                        selected
                        selectedColor={color}
                        width={8}
                        alignItems="center"
                    >
                        <Text reverse>{properties[key]}</Text>
                        <Text reverse>{value}</Text>
                        <Text reverse>{judgeDisplay(key, level)}</Text>
                    </Box>
                )
            })}
        </Box>
    )
}

interface TalentListProps {
    picked: Set<number>
    picker: (id: number) => void
}
const keys = '1234567890qwertyuiopasdfghjkl;'
function TalentList({ picked, picker }: TalentListProps) {
    const { isFocused } = useAppFocus()
    const [profile] = useProfile()
    const talents = usePicked()
    const hasInitialized = useRef(false)
    const selected = useSelect(
        Array.from(talents, (id, index) => ({
            key: keys[index],
            action: () => picker(id),
        })),
        { disableEnterConfirm: true, isActive: isFocused('main') },
    )
    useEffect(() => {
        if (!profile.locked) return
        if (!hasInitialized.current) {
            for (const id of profile.locked) {
                if (talents.has(id) && !picked.has(id)) {
                    picker(id)
                }
            }
            hasInitialized.current = true
        }
    }, [profile.locked, talents, picked, picker])

    return (
        <Box flexDirection="column">
            {Array.from(talents, (id, i) => (
                <Talent
                    index={i + 1}
                    key={id}
                    id={id}
                    picked={picked.has(id)}
                    selected={selected == i}
                    pickable
                />
            ))}
        </Box>
    )
}

export default function Summary() {
    const isClassic = useIsClassic()
    const { isFocused } = useAppFocus()
    const [locked, picker, end] = useEnd()
    const handlePicker = (id: number) => {
        if (isClassic) picker(id)
        // else toastMsg('名人天赋不可锁定', 'summary-toast')
    }
    const handleEnd = () => {
        const achievements = end()
        toastAchvs(achievements)
    }
    useInput(
        (_input, key) => {
            if (key.return) handleEnd()
        },
        { isActive: isFocused('main') },
    )
    return (
        <Box flexDirection="column" gap={1}>
            <Judges />
            <Box flexDirection="column">
                <Box justifyContent="center">
                    <Text>
                        {isClassic
                            ? '[␣]Space 你可以锁定一个天赋，下辈子还能抽到'
                            : '名人天赋不可锁定'}
                    </Text>
                </Box>
                <TalentList picked={locked} picker={handlePicker} />
            </Box>
            <Box alignItems="center" flexDirection="column" selected>
                <Text reverse>[↵]Enter 再次重开</Text>
            </Box>
        </Box>
    )
}
