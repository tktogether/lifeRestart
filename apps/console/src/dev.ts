import fs from 'fs'
import path from 'path'

const logCrash = (error: any) => {
    const logPath = path.join(process.cwd(), 'crash-debug.log')
    const message = `[CRASH TIME] ${new Date().toISOString()}\n${error?.stack || error}\n\n`
    fs.appendFileSync(logPath, message)
    process.stdout.write('\x1b[?1049l')
    process.exit(1)
}

process.on('uncaughtException', logCrash)
process.on('unhandledRejection', logCrash)
