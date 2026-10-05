import { type ComponentProps } from 'react'
import { Box } from 'ink'
import { colors } from '@/style'

export type BoxProps = ComponentProps<typeof Box>
export type SBoxProps = BoxProps & {
    selected?: boolean
    selectedColor?: BoxProps['backgroundColor']
}

export default function SBox({
    selected,
    selectedColor,
    backgroundColor,
    borderBackgroundColor,
    ...rest
}: SBoxProps) {
    return (
        <Box
            backgroundColor={
                selected ? (selectedColor ?? colors.primary) : backgroundColor
            }
            borderBackgroundColor={borderBackgroundColor ?? colors.background}
            {...rest}
        ></Box>
    )
}
