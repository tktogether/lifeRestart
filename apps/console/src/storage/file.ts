import { readFile, writeFile } from 'node:fs/promises'
const path = './storage.cache.json'
const cache = {} as Record<string, string>

export async function init() {
    try {
        const file = await readFile(path, 'utf-8')
        Object.assign(cache, JSON.parse(file))
    } catch {
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
