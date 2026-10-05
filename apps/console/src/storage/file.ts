import { homedir } from 'node:os'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
const path = `${homedir()}/.config/remake/storage.cache.json`
const cache = {} as Record<string, string>

export async function init() {
    try {
        const file = await readFile(path, 'utf-8')
        Object.assign(cache, JSON.parse(file))
    } catch {
        await mkdir(dirname(path), { recursive: true })
        await writeFile(path, JSON.stringify(cache, null, 2), 'utf-8')
    }
}

export async function get(key: string) {
    return cache[key] ?? null
}

export async function set(key: string, value: string) {
    cache[key] = value
    await writeFile(path, JSON.stringify(cache, null, 2), 'utf-8')
    return true
}
