import { useState, useMemo } from 'react'
import { useInput } from 'ink'
import { useGoHome } from '@remake/hooks'
import { useAppFocus } from '@/context/focus'
import { useScroll } from '@/hooks'
import { specialThanks, SpecialThanksGroup as Group } from '@remake/data'
import type { SpecialThanks } from '@remake/data'
import { chunksMap, shuffle } from '@remake/vitex'
import { Box, Text, type BoxProps } from '@/components'
import { ScrollView } from 'ink-scroll-view'
import { colors } from '@/style'

const groups = Map.groupBy(specialThanks, item => item.group)

export function Person({ item, ...rest }: { item: SpecialThanks } & BoxProps) {
    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor={item.color}
            {...rest}
        >
            <Text color={item.color} bold>
                {item.name}
            </Text>
            {item.comment && (
                <Text color={item.color} dimColor>
                    {item.comment}
                </Text>
            )}
        </Box>
    )
}

export function Thanks() {
    const goHome = useGoHome()
    const { isFocused } = useAppFocus()
    const isActive = isFocused('main')
    const [selected, setSelected] = useState(0)
    const scrollRef0 = useScroll({ isActive: isActive && selected === 0 })
    const scrollRef1 = useScroll({ isActive: isActive && selected === 1 })
    const group1 = useMemo(() => shuffle(groups.get(Group.G1) ?? []), [])
    const group2 = useMemo(() => shuffle(groups.get(Group.G2) ?? []), [])
    useInput(
        (input, key) => {
            if (key.tab) return setSelected(prev => (prev === 0 ? 1 : 0))
            if (key.leftArrow) return setSelected(0)
            if (key.rightArrow) return setSelected(1)
            if (key.return || key.backspace || input === ' ') goHome()
        },
        { isActive },
    )
    return (
        <Box flexDirection="column">
            <Box flexShrink={0} justifyContent="space-between" selected>
                <Text reverse>[↵]Enter</Text>
                <Text reverse>返回</Text>
            </Box>
            <Box gap={1} height="100%">
                <ScrollView
                    ref={scrollRef0}
                    height="100%"
                    flexDirection="column"
                    maxWidth={40}
                    borderStyle="single"
                    borderColor={selected === 0 ? colors.primary : undefined}
                >
                    <Box flexDirection="column">
                        {group1.map((item, index) => (
                            <Person key={index} item={item} />
                        ))}
                    </Box>
                </ScrollView>
                <ScrollView
                    ref={scrollRef1}
                    height="100%"
                    flexDirection="column"
                    maxWidth={60}
                    borderStyle="single"
                    borderColor={selected === 1 ? colors.primary : undefined}
                >
                    <Box flexDirection="column">
                        {chunksMap(group2, 3, (chunks, index) => (
                            <Box key={index}>
                                {chunks.map((item, subIndex) => (
                                    <Person
                                        key={subIndex}
                                        item={item}
                                        width={10}
                                        flexGrow={1}
                                        alignItems="center"
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                </ScrollView>
            </Box>
        </Box>
    )
}
export default Thanks
