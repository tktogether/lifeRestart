const Row = 16
const csv = await Bun.file('./age.csv').text()
const lines = csv
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
const mapped = [
    lines.shift()?.split(',').slice(0, Row).join(','),
    lines.shift()?.split(',').slice(0, Row).join(','),
]
interface WeightEvent {
    event: number
    weight: number
}

function levelIt(items: WeightEvent[]): WeightEvent[][] {
    if (items.length === 0) return []
    const levelMap = new Map<number, WeightEvent[]>()
    for (const item of items) {
        const level = Math.floor(Math.log10(item.weight))
        if (!levelMap.has(level)) levelMap.set(level, [])
        const weight = Math.round(item.weight / 10 ** level) * 10 ** level
        if (weight === 0) {
            console.warn(level, item)
        }
        levelMap.get(level)!.push({ event: item.event, weight })
    }
    const sortedLevels = Array.from(levelMap.keys()).sort((a, b) => a - b)
    const gapSplitLevels: WeightEvent[][] = []
    let currentRounded: WeightEvent[] = []
    for (let i = 0; i < sortedLevels.length; i++) {
        const levelItems = levelMap.get(sortedLevels[i]!)!
        currentRounded.push(...levelItems)
        const gap = sortedLevels[i + 1]! - sortedLevels[i]!
        if (gap >= 3) {
            const modeWeight = findModeWeight(currentRounded)
            const normalized = currentRounded.map(item => ({
                event: item.event,
                weight: item.weight / modeWeight,
            }))
            normalized.sort((a, b) => a.weight - b.weight)
            gapSplitLevels.push(normalized)
            currentRounded = []
        }
    }
    const modeWeight = findModeWeight(currentRounded)
    const normalized = currentRounded.map(item => ({
        event: item.event,
        weight: item.weight / modeWeight,
    }))
    normalized.sort((a, b) => a.weight - b.weight)
    gapSplitLevels.push(normalized)
    return gapSplitLevels
}

function findModeWeight(weights: WeightEvent[]): number {
    if (weights.length === 0) return 1
    const freq = new Map<number, number>()
    for (const { weight } of weights) {
        const level = Math.floor(Math.log10(weight))
        freq.set(level, (freq.get(level) || 0) + 1)
    }
    let maxCount = 0
    let modeWeight = 1
    for (const [level, count] of freq) {
        if (count > maxCount) {
            maxCount = count
            modeWeight = 10 ** level
        }
    }
    return modeWeight
}
function joinAge(age: number, levels: WeightEvent[][]): string {
    const final = []
    for (const level in levels) {
        let temp: any[] = [age]
        const suffix = Number(level) > 0 ? '|' + level : ''
        for (const event of levels[level]!) {
            const weight = event.weight === 1 ? '' : '*' + event.weight
            const str = `${event.event}${weight}${suffix}`
            temp.push(str)
            if (temp.length === Row) {
                final.push(temp.join(','))
                temp = [age]
            }
        }
        if (temp.length > 1) final.push(temp.join(','))
    }
    return final.join('\n')
}

function parseCsvLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current)
            current = ''
        } else {
            current += char
        }
    }
    result.push(current)
    return result
}

for (const line of lines) {
    const parts = parseCsvLine(line).filter(p => p.trim().length > 0)
    const age = parts[0]
    const events = parts.slice(1)
    const level0 = []
    const levels = []
    for (let step = 0; step < events.length; step++) {
        const e = events[step]!.split('*')
        const event = Number(e[0]!.replace(',', ''))
        let weight = e[1] ? Number(e[1].replace(',', '')) : 1
        if (weight < 9999) {
            level0.push({ event, weight })
        } else {
            levels.push({ event, weight })
        }
    }
    const leveled = levelIt(levels)
    const joined = joinAge(Number(age), [level0, ...leveled])
    mapped.push(joined)
}
Bun.write('./age.cache.csv', mapped.join('\n'))
