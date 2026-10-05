import { useTalentPuller, useTalentPicker } from '@remake/hooks'
import { useTalentSubmit, useSubmitIsEnable } from '@remake/hooks'
import { useSelect } from '@/hooks/select'
import { PullCount, dev } from '@/config'
import { useInput } from 'ink'
import { useAppFocus } from '@/context/focus'
import { Box, Text } from '@/components'
import { colors } from '@/style'
import Talent from '@/components/Talent'

interface PullProps {
    action: () => void
}
function Pull({ action }: PullProps) {
    const { isFocused } = useAppFocus()
    useInput(
        (input, key) => {
            if (key.return || input === ' ' || input.toLowerCase() === 'p')
                action()
        },
        { isActive: isFocused('main') },
    )
    return (
        <Box
            flexDirection="column"
            borderStyle="singleDouble"
            gap={1}
            selected
            width={26}
            alignItems="center"
        >
            <Text bold reverse color={colors.primary}>
                [P]ull
            </Text>
            <Text bold reverse color={colors.primary}>
                {PullCount} 连抽!
            </Text>
        </Box>
    )
}

interface TalentPickProps {
    pulled: number[]
}
const keys = '1234567890qwertyuiopasdfghjkl;'
function TalentPick({ pulled }: TalentPickProps) {
    const [talents, picker] = useTalentPicker()
    const { enabled, min, max } = useSubmitIsEnable()
    const submit = useTalentSubmit()
    const focus = useAppFocus()
    const isActive = focus.isFocused('main')
    const selected = useSelect(
        pulled.map((id, index) => ({
            key: keys[index],
            action: () => picker(id),
        })),
        { disableEnterConfirm: true, isActive },
    )
    const msg = enabled
        ? '[↵]Enter 下一步'
        : `请选取 ${min == max ? min : `${min}~${max}`} 个天赋`
    const handleSubmit = () => {
        if (enabled) return submit()
        // toastMsg(msg, 'pick-toast')
    }
    useInput(
        (_input, key) => {
            if (key.return) handleSubmit()
        },
        { isActive },
    )
    return (
        <Box flexDirection="column" gap={1}>
            <Box
                justifyContent="center"
                selected
                selectedColor={colors.primary}
            >
                <Text bold reverse>
                    [␣]Space 选择天赋
                </Text>
            </Box>
            <Box flexDirection="column">
                {pulled.map((id, i) => (
                    <Talent
                        index={i + 1}
                        key={id}
                        id={id}
                        selected={selected == i}
                        picked={talents.has(id)}
                        pickable
                    />
                ))}
            </Box>
            <Box
                justifyContent="center"
                selected
                selectedColor={enabled ? colors.primary : colors.error}
            >
                <Text bold reverse>
                    {msg}
                </Text>
            </Box>
        </Box>
    )
}

export function Pick() {
    const [pulled, puller] = useTalentPuller()
    if (!pulled) return <Pull action={puller} />
    const ps = dev.locked
        ? Array.from(new Set([...dev.locked, ...pulled]))
        : pulled
    return <TalentPick pulled={ps} />
}
export default Pick
