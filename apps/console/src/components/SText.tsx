import { type ComponentProps } from 'react'
import { Text } from 'ink'
import { colors } from '@/style'

export type TextProps = ComponentProps<typeof Text>
export type STextProps = TextProps & {
    reverse?: boolean
}

export default function SText({ color, reverse, ...rest }: STextProps) {
    return (
        <Text
            color={reverse ? colors.background : (color ?? colors.text)}
            {...rest}
        ></Text>
    )
}
