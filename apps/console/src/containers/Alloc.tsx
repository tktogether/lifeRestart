import { useState } from 'react'
import { useAllocator, usePointRandomizer, useLeftPoints } from '@remake/hooks'
import { usePicked, useReplaced, useStart, useIsClassic } from '@remake/hooks'
import { useAppFocus } from '@/context/focus'
import { useInput } from 'ink'
import { properties } from '@remake/data/etc/display'
import { keys } from '@remake/vitex'
import { judgeGradeByValue } from '@/config'
import { talents } from '@remake/data'
import { Box, Text, Replaced } from '@/components'
import { useSelect, useBreath } from '@/hooks'
import { colors, grades } from '@/style'
import { toastAchvs } from '@/toast'

const KEYS = {
    charm: 'CHR',
    intelligence: 'INT',
    strength: 'STR',
    money: 'MNY',
}
export function Alloc() {
    const isClassic = useIsClassic()
    const picked = usePicked()
    const {
        talents: { chains },
        additionalPoints: { source },
    } = useReplaced()
    const { base, left } = useLeftPoints()
    const [{ alloc, final, base: ba }, allocator] = useAllocator()
    const random = usePointRandomizer()
    const start = useStart()
    const [showDetail, setShowDetail] = useState(false)
    const breathing = useBreath(500)
    const focus = useAppFocus()
    const isActive = focus.isFocused('main')
    const selected = useSelect(
        keys(alloc).map(key => ({ key: KEYS[key][0] })),
        {
            horizontal: true,
            disableEnterConfirm: true,
            disableSpaceConfirm: true,
            isActive,
        },
    )
    useInput(
        (input, key) => {
            if (input.toLowerCase() === 'r') return random()
            if (input.toLowerCase() === 'l') return setShowDetail(prev => !prev)
            if (key.return || input === ' ') return handleNext()
            const s = keys(alloc)[selected]
            if (!s) return
            if (key.downArrow || input == '-' || input == '[') {
                return allocator(s, alloc[s] - 1)
            }
            if (key.upArrow || input == '+' || input == ']') {
                return allocator(s, alloc[s] + 1)
            }
            if (input && '0123456789'.includes(input)) {
                return allocator(s, parseInt(input))
            }
        },
        { isActive },
    )
    const handleNext = () => {
        if (left != 0) return // toastMsg('还有剩余点数未分配', 'alloc-toast')
        const achievements = start()
        toastAchvs(achievements)
    }
    return (
        <Box flexDirection="column" gap={1} marginLeft={2}>
            <Box flexDirection="column">
                {Array.from(picked, id => (
                    <Replaced key={id} id={id} chains={chains.get(id)} />
                ))}
            </Box>
            {showDetail && (
                <Box
                    flexDirection="column"
                    marginRight={2}
                    backgroundColor={colors.info}
                >
                    <Box justifyContent="space-between">
                        <Text reverse>{isClassic ? '基础' : '固定'}</Text>
                        <Box width={7} justifyContent="space-between">
                            <Text reverse>[</Text>
                            <Text reverse>{base} ]</Text>
                        </Box>
                    </Box>
                    {source.map(({ talent, points }) => (
                        <Box key={talent} justifyContent="space-between">
                            <Text reverse>
                                {talents.get(talent)?.name ?? talent}
                            </Text>
                            <Box width={7} justifyContent="space-between">
                                <Text reverse>[</Text>
                                <Text reverse>{points} ]</Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
            <Box gap={1} marginRight={2}>
                <Box
                    flexDirection="column"
                    width={10}
                    selected
                    selectedColor={left ? colors.error : colors.success}
                >
                    <Box justifyContent="space-between">
                        <Text reverse>[L]E</Text>
                        <Text reverse>剩余点</Text>
                    </Box>
                    {!isClassic && <Box height={1}></Box>}
                    <Box justifyContent="space-between">
                        <Text reverse>[</Text>
                        <Text reverse>{left}</Text>
                        <Text reverse>]</Text>
                    </Box>
                </Box>
                {keys(alloc).map((key, index) => {
                    const grade = judgeGradeByValue(key, final[key])
                    const s = breathing && selected == index
                    return (
                        <Box key={key} flexDirection="column" width={10}>
                            <Box
                                justifyContent="space-between"
                                selected
                                selectedColor={grades[grade]}
                            >
                                <Text reverse>
                                    [{KEYS[key][0]}]{KEYS[key].substring(1)}
                                </Text>
                                <Text reverse>{properties[key]}</Text>
                            </Box>
                            {!isClassic && (
                                <Box justifyContent="space-between">
                                    <Text>[{ba[key]}]</Text>
                                    <Text>{final[key]}</Text>
                                </Box>
                            )}
                            <Box
                                justifyContent="space-between"
                                selected={s}
                                selectedColor={colors.primary}
                            >
                                <Text reverse={s}>[</Text>
                                <Text reverse={s}>{alloc[key]}</Text>
                                <Text reverse={s}>]</Text>
                            </Box>
                        </Box>
                    )
                })}
            </Box>
            <Box justifyContent="space-between" marginRight={2}>
                <Box
                    selected
                    width={26}
                    selectedColor={colors.secondary}
                    justifyContent="space-between"
                >
                    <Text reverse>[R]andom</Text>
                    <Text reverse>随机分配</Text>
                </Box>
                <Box
                    selected
                    width={26}
                    selectedColor={left ? colors.error : colors.primary}
                    justifyContent="space-between"
                >
                    <Text reverse>[↵]Enter</Text>
                    <Text reverse>开始新人生</Text>
                </Box>
            </Box>
        </Box>
    )
}
export default Alloc
