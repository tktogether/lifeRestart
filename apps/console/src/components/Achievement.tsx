import { type Achievement as A, achievement } from '@remake/data'
import { Box, Text } from '.'
import { grades, colors } from '@/style'

export interface AchievementProps {
    id: A['id']
}
export function Achievement({ id }: AchievementProps) {
    const ach = achievement.get(id)
    if (!ach) return null
    const grade = ach?.grade ?? 0
    return (
        <Box
            borderStyle="single"
            borderColor={grades[grade]}
            backgroundColor={colors.background}
            gap={1}
        >
            <Text color={grades[grade]} bold>
                🏆 {ach.name}
            </Text>
            <Text color={grades[grade]} dimColor>
                {ach.description}
            </Text>
        </Box>
    )
}

export default Achievement
