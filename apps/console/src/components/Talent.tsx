import { type Talent as T, talents } from '@remake/data'
import { Text, Box, type BoxProps } from '.'
import { grades, colors } from '@/style'

export type TalentProps = BoxProps & {
    id: T['id']
    index?: number
    selected?: boolean
    picked?: boolean
    pickable?: boolean
}
export function Talent({
    id,
    index,
    selected,
    picked,
    pickable,
    ...rest
}: TalentProps) {
    const talent = talents.get(id)
    if (!talent) return null
    const grade = talent?.grade ?? 0
    return (
        <Box
            justifyContent="space-between"
            selected={selected}
            selectedColor={grades[grade]}
            {...rest}
        >
            <Box marginRight={2} width={20}>
                {pickable && (
                    <Box
                        selected={picked || selected}
                        selectedColor={colors.primary}
                    >
                        <Text
                            color={colors.primary}
                            reverse={picked || selected}
                        >
                            [{picked ? '*' : ' '}]
                        </Text>
                    </Box>
                )}
                {index != null && (
                    <Text bold color={grades[grade]} reverse={selected}>
                        {index.toString().padStart(2, ' ') + ' '}
                    </Text>
                )}
                <Text bold color={grades[grade]} reverse={selected}>
                    {talent.name}
                </Text>
            </Box>
            <Text
                dimColor
                color={grades[grade]}
                reverse={selected}
                wrap="truncate-middle"
            >
                {talent.description}
            </Text>
        </Box>
    )
}

export default Talent
