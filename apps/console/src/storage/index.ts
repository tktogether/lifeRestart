import * as file from './file'

interface Storage {
    init(): Promise<void>
    get(key: string): Promise<string | null>
    set(key: string, value: string): Promise<boolean>
}
const storage = {} as Storage

storage.init = file.init
storage.get = file.get
storage.set = file.set

export const init = storage.init
export const get = storage.get
export const set = storage.set
