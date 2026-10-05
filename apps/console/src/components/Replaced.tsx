import { type Talent as T, talents } from '@remake/data'
import Talent from './Talent'
import { Box, Text } from '@/components'

export interface TalentProps {
    id: T['id']
    chains?: T['id'][]
}
export function Replaced({ id, chains }: TalentProps) {
    return (
        <Box flexDirection="column">
            <Talent id={id} flexGrow={1} marginRight={2} />
            {chains?.map(id => {
                const talent = talents.get(id)
                if (!talent) return null
                return (
                    <Box key={id} flexDirection="row">
                        <Talent id={id} flexGrow={1} />
                        <Box width={2}>
                            <Text>⤶</Text>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}

export default Replaced
