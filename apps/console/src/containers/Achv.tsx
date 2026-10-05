import { useInput } from 'ink'
import { useAchv, useGoHome } from '@remake/hooks'
import { useScroll } from '@/hooks'
import { useAppFocus } from '@/context/focus'
import { judge, judgeGrade, judgeGradeByValue } from '@/config'
import { rates } from '@remake/data/etc/display'
import { achievements, type Achievement } from '@remake/data'
import { Box, Text } from '@/components'
import { ScrollView } from 'ink-scroll-view'
import { grades } from '@/style'
import { chunksMap } from '@remake/vitex'

interface AchievementProps {
    id: Achievement['id']
    colled: boolean
}
export function AchievementItem({ id, colled }: AchievementProps) {
    const { name, grade, description, hide } = achievements.get(id)!
    const color = grades[grade]
    const h = hide && !colled ? '???' : undefined
    return (
        <Box
            selected={colled}
            selectedColor={color}
            flexDirection="column"
            alignItems="center"
            borderStyle="single"
            borderColor={color}
            width={20}
            flexGrow={1}
            borderDimColor={!colled}
        >
            <Text color={color} dimColor={!colled} reverse={colled} bold>
                {h ?? name}
            </Text>
            <Text color={color} dimColor={!colled}>
                {h ?? description}
            </Text>
        </Box>
    )
}

export function Achv() {
    const goHome = useGoHome()
    const { isFocused } = useAppFocus()
    const isActive = isFocused('main')
    const scrollRef = useScroll({ isActive })
    const [stats, sorted] = useAchv()
    const jtimes = judge('times', stats.times)
    const gtimes = judgeGrade('times', jtimes)
    const jachv = judge('achievements', stats.achv)
    const gachv = judgeGrade('achievements', jachv)
    const gevent = judgeGradeByValue('event', stats.event)
    const revent = stats.event.toFixed(2) + '%'
    const gtalent = judgeGradeByValue('talent', stats.talent)
    const rtalent = stats.talent.toFixed(2) + '%'
    useInput(
        (input, key) => {
            if (key.return || key.backspace || input === ' ') goHome()
        },
        { isActive },
    )
    return (
        <Box flexDirection="column" height="100%">
            <Box flexShrink={0} justifyContent="space-between" selected>
                <Text reverse>[↵]Enter</Text>
                <Text reverse>返回</Text>
            </Box>
            <ScrollView
                ref={scrollRef}
                height="100%"
                maxWidth={70}
                flexDirection="column"
            >
                <Box flexDirection="column" flexShrink={0}>
                    <Box
                        justifyContent="center"
                        borderStyle="double"
                        borderBottom={false}
                        borderRight={false}
                        borderLeft={false}
                    >
                        <Text bold>统计</Text>
                    </Box>
                    <Box>
                        <Box
                            flexDirection="column"
                            flexGrow={1}
                            borderStyle="single"
                            borderColor={grades[gtimes]}
                            alignItems="center"
                        >
                            <Text color={grades[gtimes]} bold>
                                已重开{stats.times}次
                            </Text>
                            <Text color={grades[gtimes]} dimColor>
                                {rates.times[jtimes]}
                            </Text>
                        </Box>
                        <Box
                            flexDirection="column"
                            flexGrow={1}
                            borderStyle="single"
                            borderColor={grades[gachv]}
                            alignItems="center"
                        >
                            <Text color={grades[gachv]} bold>
                                已收集成就{stats.achv}个
                            </Text>
                            <Text color={grades[gachv]} dimColor>
                                {rates.achievement[jachv]}
                            </Text>
                        </Box>
                        <Box
                            flexDirection="column"
                            flexGrow={1}
                            borderStyle="single"
                            borderColor={grades[gevent]}
                            alignItems="center"
                        >
                            <Text color={grades[gevent]} bold>
                                事件收集率
                            </Text>
                            <Text color={grades[gevent]} dimColor>
                                {revent}
                            </Text>
                        </Box>
                        <Box
                            flexDirection="column"
                            flexGrow={1}
                            borderStyle="single"
                            borderColor={grades[gtalent]}
                            alignItems="center"
                        >
                            <Text color={grades[gtalent]} bold>
                                天赋收集率
                            </Text>
                            <Text color={grades[gtalent]} dimColor>
                                {rtalent}
                            </Text>
                        </Box>
                    </Box>
                </Box>
                <Box flexDirection="column" flexGrow={1}>
                    <Box
                        justifyContent="center"
                        borderStyle="double"
                        borderBottom={false}
                        borderRight={false}
                        borderLeft={false}
                    >
                        <Text bold>成就</Text>
                    </Box>
                    <Box flexDirection="column">
                        {chunksMap(sorted, 3, (chunks, index) => (
                            <Box
                                key={index}
                                gap={1}
                                justifyContent="space-between"
                            >
                                {chunks.map(item => (
                                    <AchievementItem
                                        key={item.id}
                                        id={item.id}
                                        colled={item.colled}
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    )
}
export default Achv
