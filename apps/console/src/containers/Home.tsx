import { useRemake, useFeatures, useGoAchv, useGoThanks } from '@remake/hooks'
import { useSelect } from '@/hooks/select'
import { Box, Text } from '@/components'
import { colors } from '@/style'
import { useAppFocus } from '@/context/focus'

const banner = [
    '██████╗',
    '██╔══██╗ █████╗  ███╗███╗ █████╗ ██╗  ██╗ █████╗',
    '██████╔╝██╔══██╗██╔██╔██║██╔══██╗██║ ██╔╝██╔══██╗',
    '██╔══██╗███████║██║██║██║██║  ██║█████╔╝ ███████║',
    '██║  ██║██╔════╝██║██║██║██║████║██╔═██╗ ██╔════╝',
    '██║  ██║ ██████╗██║██║██║ ███╔██║██║  ██╗ ██████╗',
    '╚═╝  ╚═╝ ╚═════╝╚═╝╚═╝╚═╝ ╚══╝╚═╝╚═╝  ╚═╝ ╚═════╝',
]

type RGBColor = [number, number, number]
function colorGradient(
    pos: number,
    total: number,
    start: RGBColor,
    end: RGBColor,
) {
    const ratio = pos / (total - 1 || 1)
    const r = Math.round(start[0] + (end[0] - start[0]) * ratio)
    const g = Math.round(start[1] + (end[1] - start[1]) * ratio)
    const b = Math.round(start[2] + (end[2] - start[2]) * ratio)
    return `rgb(${r}, ${g}, ${b})`
}

const width = Math.max(...banner.map(line => line.length))
const sc: RGBColor = [83, 114, 223]
const ec: RGBColor = [195, 103, 127]
const dim = '═║╚╝╔╗'
function Banner() {
    return (
        <Box
            width="100%"
            height={banner.length}
            flexDirection="column"
            position="relative"
            overflow="hidden"
        >
            {banner.map((line, index) => (
                <Box key={index} overflow="hidden" height={1} width="100%">
                    {Array.from({ length: width }, (_, index) => (
                        <Text
                            bold
                            key={index}
                            dimColor={dim.includes(line[index] ?? ' ')}
                            color={colorGradient(index, width, sc, ec)}
                        >
                            {line[index] ?? ' '}
                        </Text>
                    ))}
                </Box>
            ))}
            <Box
                position="absolute"
                right={0}
                top={0}
                overflow="hidden"
                height={1}
            >
                <Text bold color={colorGradient(0, width, sc, ec)} wrap="hard">
                    人生重开模拟器・
                </Text>
                <Text color={colorGradient(0, width, sc, ec)} wrap="hard">
                    这垃圾人生一秒也不想待了
                </Text>
            </Box>
        </Box>
    )
}

function Menu() {
    const features = useFeatures()
    const { isFocused } = useAppFocus()
    const selected = useSelect(
        [
            { key: 'r', action: useRemake() },
            { key: 'a', action: useGoAchv(), disabled: !features },
            { key: 't', action: useGoThanks(), disabled: !features },
        ],
        { isActive: isFocused('main') },
    )
    return (
        <Box flexDirection="column" width={35}>
            <Box justifyContent="space-between" selected={selected === 0}>
                <Text color={colors.primary} reverse={selected === 0}>
                    [R]emake
                </Text>
                <Text bold color={colors.primary} reverse={selected === 0}>
                    立即重开
                </Text>
            </Box>
            {features && (
                <Box
                    justifyContent="space-between"
                    selected={selected === 1}
                    selectedColor={colors.secondary}
                >
                    <Text color={colors.secondary} reverse={selected === 1}>
                        [A]chievement
                    </Text>
                    <Text
                        bold
                        color={colors.secondary}
                        reverse={selected === 1}
                    >
                        成就
                    </Text>
                </Box>
            )}
            {features && (
                <Box
                    justifyContent="space-between"
                    selected={selected === 2}
                    selectedColor={colors.secondary}
                >
                    <Text color={colors.secondary} reverse={selected === 2}>
                        [T]hanks
                    </Text>
                    <Text
                        bold
                        color={colors.secondary}
                        reverse={selected === 2}
                    >
                        感谢
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default function Home() {
    return (
        <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1}
        >
            <Banner />
            <Menu />
        </Box>
    )
}
