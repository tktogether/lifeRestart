import { useCharaPuller, useCharaPicker, useCharaSubmit } from '@remake/hooks'
import { useUnique, useUniqueGenerator, convertProps } from '@remake/hooks'
import { useSelect } from '@/hooks/select'
import { useInput } from 'ink'
import { useEffect } from 'react'
import { useAppFocus } from '@/context/focus'
import type { BaseChara } from '@remake/hooks'
import { judgeGradeByValue } from '@/config'
import { characters } from '@remake/data'
import { properties } from '@remake/data/etc/display'
import { Box, Text } from '@/components'
import { keys } from '@remake/vitex'
// import { toastMsg } from '@/toast'
import Talent from '@/components/Talent'
import { colors, grades } from '@/style'

function Details({ detail }: { detail: BaseChara }) {
    const props = convertProps(detail.property)
    return (
        <Box flexDirection="column" gap={1}>
            <Box justifyContent="space-around">
                {keys(props).map(key => {
                    const color = grades[judgeGradeByValue(key, props[key])]
                    return (
                        <Box
                            key={key}
                            flexDirection="column"
                            alignItems="center"
                        >
                            <Text color={color} bold>
                                {properties[key]}
                            </Text>
                            <Text color={color} bold>
                                {props[key]}
                            </Text>
                        </Box>
                    )
                })}
            </Box>
            <Box flexDirection="column">
                {detail.talent.map(id => (
                    <Talent key={id} id={id} />
                ))}
            </Box>
        </Box>
    )
}

interface UniqueProps {
    selected?: boolean
}
function Unique({ selected }: UniqueProps) {
    const { isFocused } = useAppFocus()
    const [unique, generator] = useUniqueGenerator()
    useInput(
        input => {
            if (!selected) return
            if (unique) return
            if (input === ' ' || input.toUpperCase() === 'G') generator()
        },
        { isActive: isFocused('main') },
    )
    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor={selected ? colors.primary : undefined}
            gap={1}
        >
            <Box position="absolute" top={0} left={0}>
                <Text>[1]</Text>
            </Box>
            <Box alignSelf="center">
                <Text bold>独一无二的我</Text>
            </Box>
            {selected && unique && <Details detail={unique} />}
            {selected && !unique && (
                <Box flexDirection="column" gap={1}>
                    <Box flexDirection="column" alignItems="center">
                        <Text>6000万玩家中独一无二的角色卡</Text>
                        <Text>所有属性 所有天赋 随机生成</Text>
                        <Text>每人只能生成一次</Text>
                    </Box>
                    <Box selected justifyContent="center">
                        <Text reverse>[␣]Space 生成唯一角色</Text>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

interface CharacterProps {
    id: number
    selected?: boolean
    index: number
}
function Character({ id, selected, index }: CharacterProps) {
    const character = characters.get(id)!
    return (
        <Box
            flexDirection="column"
            borderStyle="single"
            borderColor={selected ? colors.primary : undefined}
            gap={1}
        >
            <Box position="absolute" top={0} left={0}>
                <Text>[{index}]</Text>
            </Box>
            <Box alignSelf="center">
                <Text bold>{character.name}</Text>
            </Box>
            {selected && <Details detail={character} />}
        </Box>
    )
}

const KEYS = '1234567890qwertyuiopasdfghjkl;'
export function Chara() {
    const focus = useAppFocus()
    const isActive = focus.isFocused('main')
    const u = useUnique()
    const [{ unique, characters }, puller] = useCharaPuller()
    const [picked, picker] = useCharaPicker()
    const submit = useCharaSubmit()
    const selected = useSelect(
        Array.from(
            { length: characters.length + (unique ? 1 : 0) },
            (_id, index) => ({
                key: KEYS[index],
            }),
        ),
        { disableEnterConfirm: true, disableSpaceConfirm: true, isActive },
    )
    const handleSubmit = () => {
        if (ready) return submit(picked)
        // if (!picked) toastMsg('请先选择角色', 'chara-toast-pick')
        // else toastMsg('请先生成唯一角色', 'chara-toast-unique')
    }
    const ready = picked && (picked.type === 'unique' ? !!u : true)
    useInput(
        (input, key) => {
            if (input.toUpperCase() === 'R') puller()
            if (key.return) handleSubmit()
        },
        { isActive },
    )
    useEffect(() => {
        if (!unique) {
            picker.chara(characters[selected]!)
        } else if (selected) {
            picker.chara(characters[selected - 1]!)
        } else {
            picker.unique()
        }
    }, [characters, selected, unique])
    return (
        <Box flexDirection="column">
            <Box flexDirection="column" width={50}>
                {unique && <Unique selected={picked?.type === 'unique'} />}
                {characters.map((id, index) => (
                    <Character
                        key={id}
                        id={id}
                        selected={picked?.id === id}
                        index={index + (unique ? 2 : 1)}
                    />
                ))}
            </Box>
            <Box justifyContent="space-between">
                <Box
                    justifyContent="space-between"
                    width={24}
                    selected
                    selectedColor={colors.secondary}
                >
                    <Text reverse>[R]andom</Text>
                    <Text reverse>都不是</Text>
                </Box>
                <Box
                    justifyContent="space-between"
                    width={24}
                    selected
                    selectedColor={ready ? colors.success : colors.error}
                >
                    <Text reverse>[↵]Enter</Text>
                    <Text reverse>开始新人生</Text>
                </Box>
            </Box>
        </Box>
    )
}

export default Chara
