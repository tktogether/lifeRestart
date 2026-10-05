import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppFocus } from '@/context/focus'
import { useNext, useGotoSummary, type Log } from '@remake/hooks'
import { useJudge, useScroll } from '@/hooks'
import { useInput } from 'ink'
import { achievements, events, talents } from '@remake/data'
import { properties } from '@remake/data/etc/display'
import { AutoInterval } from '@/config'
import { format } from '@remake/vitex'
import { grades, colors } from '@/style'
import { Box, Text } from '@/components'
import { ScrollView } from 'ink-scroll-view'
import { toastAchvs } from '@/toast'

function LogTalent({ id }: { id: number }) {
    const { name, description, grade } = talents.get(id)!
    return (
        <Box gap={1}>
            <Text bold color={grades[grade]}>
                [天赋]
            </Text>
            <Text bold color={grades[grade]}>
                {name}
            </Text>
            <Text color={grades[grade]} dimColor>
                {description}
            </Text>
        </Box>
    )
}

function LogTalents({ items }: { items: number[] }) {
    if (items.length === 0) return null
    const els = items.map(id => <LogTalent key={id} id={id} />)
    return <Box flexDirection="column">{els}</Box>
}

const year = new Date().getFullYear()
interface LogEventProps {
    id: number
    post: boolean
    index: number
}
function LogEvent({ id, post, index }: LogEventProps) {
    let { event, postEvent, grade, format: f } = events.get(id)!
    if (f) {
        const g = (key: string) => ({ CurrentYear: year + index })[key]
        event = format(event, g)
        if (post && postEvent) postEvent = format(postEvent, g)
    }
    return (
        <>
            <Box>
                <Text bold color={grades[grade]}>
                    {event}
                </Text>
            </Box>
            {post && postEvent && (
                <Box>
                    <Text bold color={grades[grade]}>
                        {postEvent}
                    </Text>
                </Box>
            )}
        </>
    )
}

function LogEvents({ items, index }: { items: number[]; index: number }) {
    const last = items.length - 1
    const els = items.map((id, i) => (
        <LogEvent key={id} id={id} post={i == last} index={index} />
    ))
    return <Box flexDirection="column">{els}</Box>
}

function LogAchievement({ id }: { id: number }) {
    const { name, description, grade } = achievements.get(id)!
    return (
        <Box gap={1}>
            <Text bold color={grades[grade]}>
                [成就]
            </Text>
            <Text bold color={grades[grade]}>
                {name}
            </Text>
            <Text color={grades[grade]} dimColor>
                {description}
            </Text>
        </Box>
    )
}

function LogAchievements({ items }: { items: number[] }) {
    if (items.length === 0) return null
    const els = items.map(id => <LogAchievement key={id} id={id} />)
    return <Box flexDirection="column">{els}</Box>
}

function Log({ log, index }: { log: Log; index: number }) {
    return (
        <Box>
            <Box flexDirection="column" flexShrink={0} width={6}>
                <Box justifyContent="flex-end" paddingRight={1}>
                    <Text color={colors.primary}>{log.age}岁</Text>
                </Box>
                <Box
                    flexGrow={1}
                    borderStyle={{
                        topLeft: ' ',
                        top: ' ',
                        topRight: '│',
                        left: ' ',
                        bottomLeft: ' ',
                        bottom: ' ',
                        bottomRight: '└',
                        right: '│',
                    }}
                    borderTop={false}
                    borderLeft={false}
                ></Box>
            </Box>
            <Box
                flexDirection="column"
                borderStyle="single"
                borderTop={false}
                borderLeft={false}
                borderRight={false}
            >
                <LogTalents items={log.talents} />
                <LogEvents items={log.events} index={index} />
                <LogAchievements items={log.achievements} />
            </Box>
        </Box>
    )
}

interface PropProps {
    prop: keyof typeof properties
    value: number
    grade: number
}

function Prop({ prop, value, grade }: PropProps) {
    const color = grades[grade]
    const prevRef = useRef<number>(value)
    const [displayValue, setDisplayValue] = useState<number>(value)
    useEffect(() => {
        const prev = prevRef.current
        if (value === prev) return
        prevRef.current = value
        return () => {
            setDisplayValue(value)
        }
    }, [value])

    return (
        <Box flexDirection="column">
            <Box justifyContent="center" selected selectedColor={color}>
                <Text reverse>{properties[prop]}</Text>
            </Box>
            <Box justifyContent="space-between">
                <Text color={color}>[</Text>
                <Text color={color}>{displayValue}</Text>
                <Text color={color}>]</Text>
            </Box>
        </Box>
    )
}

function Properties() {
    const judges = useJudge()
    return (
        <Box flexDirection="column" gap={1}>
            {judges.map(([key, { value, grade }]) => (
                <Prop key={key} prop={key} value={value} grade={grade} />
            ))}
        </Box>
    )
}

export function Play() {
    const [{ logs, ended }, next] = useNext()
    const [auto, setAuto] = useState(false)
    const { isFocused } = useAppFocus()
    const isActive = isFocused('main')
    const logRef = useScroll({ isActive })
    const autoRef = useRef<ReturnType<typeof setInterval>>(undefined)
    const processRef = useRef(false)
    const gotoSummary = useGotoSummary()
    const handleNext = useCallback(() => {
        if (ended) return
        if (processRef.current) return
        processRef.current = true
        const achievements = next()
        toastAchvs(achievements)
        processRef.current = false
    }, [ended, next])
    const handleGotoSummary = useCallback(() => {
        if (!ended) return
        const achievements = gotoSummary()
        toastAchvs(achievements)
    }, [ended, gotoSummary])
    useEffect(() => {
        if (!auto) clearInterval(autoRef.current)
        else autoRef.current = setInterval(handleNext, AutoInterval)
        return () => clearInterval(autoRef.current)
    }, [auto, handleNext])
    useInput(
        (input, key) => {
            if (ended) {
                if (key.return) handleGotoSummary()
                return
            }
            if (input.toLowerCase() === 'a') setAuto(!auto)
            if (key.return || input === ' ') handleNext()
        },
        { isActive },
    )
    return (
        <Box height="100%" gap={2}>
            <Box
                flexDirection="column"
                width={12}
                flexShrink={0}
                height="100%"
                justifyContent="space-between"
            >
                <Properties />
                <Box flexDirection="column" selected={ended || auto}>
                    {ended ? (
                        <Text reverse>[↵] 人生总结</Text>
                    ) : (
                        <Text reverse={auto}>[A]uto{'  '}自动</Text>
                    )}
                </Box>
            </Box>
            <Box
                flexDirection="column"
                height="100%"
                minWidth={40}
                maxWidth={70}
            >
                <ScrollView
                    ref={logRef}
                    height="100%"
                    onContentHeightChange={() => {
                        logRef.current?.scrollToBottom()
                    }}
                >
                    {logs.map((log, index) => (
                        <Log key={index} log={log} index={index} />
                    ))}
                </ScrollView>
            </Box>
        </Box>
    )
}

export default Play
