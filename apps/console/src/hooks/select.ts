import { useState, useMemo } from 'react'
import { useInput } from 'ink'

export interface Select {
    disabled?: boolean
    key?: string
    action?: () => void
}

export type UseSelectOptions = Parameters<typeof useInput>[1] & {
    disableEnterConfirm?: boolean
    disableSpaceConfirm?: boolean
    horizontal?: boolean
}

export function useSelect(items: Select[], options: UseSelectOptions = {}) {
    const [selected, setSelected] = useState(0)
    const keyMap = useMemo(
        () =>
            items.reduce((acc, item, index) => {
                if (item.key) acc.set(item.key.toLowerCase(), index)
                return acc
            }, new Map<string, number>()),
        [items],
    )
    useInput((input, key) => {
        if (keyMap.has(input.toLowerCase())) {
            const index = keyMap.get(input.toLowerCase())!
            if (!items[index]?.disabled) {
                setSelected(index)
                items[index]?.action?.()
            }
            return
        }
        if (options.horizontal ? key.leftArrow : key.upArrow) {
            setSelected(prev => {
                let next = prev === 0 ? items.length - 1 : prev - 1
                while (items[next]?.disabled) {
                    next = next === 0 ? items.length - 1 : next - 1
                    if (next === prev) break
                }
                return next
            })
            return
        }
        if (key.tab || (options.horizontal ? key.rightArrow : key.downArrow)) {
            setSelected(prev => {
                let next = prev === items.length - 1 ? 0 : prev + 1
                while (items[next]?.disabled) {
                    next = next === items.length - 1 ? 0 : next + 1
                    if (next === prev) break
                }
                return next
            })
            return
        }
        if (
            (!options.disableEnterConfirm && key.return) ||
            (!options.disableSpaceConfirm && input === ' ')
        ) {
            items[selected]?.action?.()
        }
    }, options)
    return selected
}
