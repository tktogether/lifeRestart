import { useCallback, useRef } from 'react'
import type { ScrollViewRef } from 'ink-scroll-view'
import { useInput } from 'ink'

export type UseScrollOptions = Parameters<typeof useInput>[1]

export function useScroll(options: UseScrollOptions = {}) {
    const scrollRef = useRef<ScrollViewRef>(null)
    const handleScroll = useCallback((v: number, line = true) => {
        const ref = scrollRef.current
        if (!ref) return
        const h = ref.getViewportHeight() || 1
        const ch = ref.getContentHeight() || 1
        const c = ref.getScrollOffset() || 0
        const maxOffset = ch - h
        const offset = v * (line ? 1 : h)
        ref.scrollTo(Math.min(Math.max(c + offset, 0), maxOffset))
    }, [])
    useInput((_input, key) => {
        if (!scrollRef.current) return
        if (key.upArrow) {
            handleScroll(-1)
        } else if (key.downArrow) {
            handleScroll(1)
        } else if (key.pageUp) {
            handleScroll(-1, false)
        } else if (key.pageDown) {
            handleScroll(1, false)
        } else if (key.home) {
            scrollRef.current.scrollToTop()
        } else if (key.end) {
            scrollRef.current.scrollToBottom()
        }
    }, options)
    return scrollRef
}
