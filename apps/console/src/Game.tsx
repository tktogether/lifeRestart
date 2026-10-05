import { useEffect, useState } from 'react'
import { useInit, useWatcher, useSelect } from '@/hooks'
import { useStep, Step } from '@remake/hooks'
import { useStdout, useApp, useInput } from 'ink'
import { Box, Text } from '@/components'
import { colors } from '@/style'
import { FocusProvider, useAppFocus } from '@/context/focus'
import ToastAchvContainer from '@/toast/Achv'
import Home from '@/containers/Home'
import Mode from '@/containers/Mode'
import Chara from '@/containers/Chara'
import Pick from '@/containers/Pick'
import Alloc from '@/containers/Alloc'
import Play from '@/containers/Play'
import Summary from '@/containers/Summary'
import Achv from '@/containers/Achv'
import Thanks from '@/containers/Thanks'

export function Container() {
    /* prettier-ignore */
    switch (useStep()) {
        case Step.Idle: return <Home />
        case Step.Mode: return <Mode />
        case Step.Chara: return <Chara />
        case Step.Pick: return <Pick />
        case Step.Alloc: return <Alloc />
        case Step.Play: return <Play />
        case Step.Summary: return <Summary />
        case Step.Achv: return <Achv />
        case Step.Thanks: return <Thanks />
        default: return null
    }
}

/* prettier-ignore */
const Loading = () => <Text>载入中...</Text>
const Saving = ({ active }: { active: boolean }) =>
    active && <Text>保存中...</Text>
const Escape = ({ onCancel }: { onCancel?: () => void }) => {
    const app = useApp()
    const selected = useSelect([
        {
            key: 'y',
            action: app.exit,
        },
        {
            key: 'n',
            action: onCancel,
        },
    ])
    return (
        <Box
            position="absolute"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                backgroundColor={colors.background}
                borderStyle="single"
                width={20}
            >
                <Text>要退出吗？</Text>
                <Box selected={selected === 0} marginTop={1}>
                    <Text reverse={selected === 0}>[Y]es{'   '}是</Text>
                </Box>
                <Box selected={selected === 1}>
                    <Text reverse={selected === 1}>[N]o{'    '}否</Text>
                </Box>
            </Box>
        </Box>
    )
}

export function GameContainer() {
    const { stdout } = useStdout()
    const saving = useWatcher()
    const [height, setHeight] = useState(stdout.rows)
    const [showEscape, setShowEscape] = useState(false)
    const focus = useAppFocus()
    useEffect(() => {
        stdout.on('resize', () => {
            setHeight(stdout.rows)
        })
    }, [stdout])
    useEffect(() => {
        if (showEscape) {
            focus.setFocus('modal')
        } else {
            focus.setFocus('main')
        }
    }, [showEscape])
    useInput((_input, key) => {
        if (key.escape) setShowEscape(prev => !prev)
    })
    return (
        <Box
            height={height}
            justifyContent="center"
            alignItems="center"
            backgroundColor={colors.background}
        >
            <Container />
            <ToastAchvContainer />
            <Saving active={saving} />
            {showEscape && (
                <Escape
                    onCancel={() => {
                        setShowEscape(false)
                    }}
                />
            )}
        </Box>
    )
}

export function Game() {
    const [inited, init] = useInit()
    useEffect(() => {
        if (!inited) init()
    }, [inited, init])
    if (!inited) return <Loading />
    return (
        <FocusProvider>
            <GameContainer />
        </FocusProvider>
    )
}

export default Game
