/**
 * @typedef {Object} reader
 * @property {function(string): Promise<FileData[]>} getDirectoryFilesList
 * @property {function(string): Promise<TextureData[]>} getModelTextures
 * @property {function(FileData, TextureData[]): Promise<void>} setModelTextures
 */

/**
 * @typedef {Object} FileData
 * @property {string} root
 * @property {string} dir
 * @property {string} ext
 * @property {string} name
 * @property {string} path
 * @property {string} dirRelative
 * @property {string} baseRelative
 * @property {string} file
 */

/**
 * @typedef {Object} TextureData
 * @property {number} offset
 * @property {string} name
 * @property {string} nameLC
 */

/** */
const fs = require('fs')
const path = require('path')

/**
 * @param {FileData} file
 * @returns {TextureData[]}
 */
const getModelTextures = file => {
    /** @type {TextureData[]} */ const out = []

    const buf4 = Buffer.alloc(4)
    const fileHandle = fs.openSync(file.file, 'r')
    const stats = fs.statSync(file.file)

    let cursor = 0

    const read4 = () => {
        fs.readSync(fileHandle, buf4, 0, 4, cursor)
        cursor += 4
        return buf4
    }

    if (read4().readUint32BE() !== 0x4d444c58/*MDLX*/) return out

    const buf260 = Buffer.alloc(260)

    const decoder = new TextDecoder('utf8')
    while (cursor < stats.size) {
        const key = read4().readUint32BE()
        const size = read4().readUint32LE()
        if (key === 0x54455853 /*TEXS*/) {
            const end = cursor + size
            //id = 4, name = 260, flags = 4
            for (; cursor < end; cursor += 268) {
                const position = cursor + 4
                fs.readSync(fileHandle, buf260, 0, 260, position)
                let i = 0
                for (; i < buf260.length; i++) {
                    if (buf260.readInt8(i) === 0) break
                }
                const name = decoder.decode(buf260.subarray(0, i))
                out.push({
                    offset: position,
                    name: name,
                    nameLC: name.toLowerCase()
                })
            }
            if (cursor !== end) throw new Error('TEXS chunk corrupted')
            break
        }
        cursor += size
    }

    fs.closeSync(fileHandle)

    return out
}

/**
 * @param {FileData} file
 * @param {TextureData[]} textures
 */
const setModelTextures = (file, textures) => {
    const fileHandle = fs.openSync(file.file, 'r+')
    const array = new Uint8Array(260).fill(0)
    const encoder = new TextEncoder('utf8')

    for (const texture of textures) {
        const data = encoder.encode(texture.name)
        array.set(data)
        fs.writeSync(fileHandle, array, 0, array.length, texture.offset)
    }
    fs.closeSync(fileHandle)
}

const reader = {
    /**
     * @param {string} dirpath
     * @returns {FileData[]}
     */
    getDirectoryFilesList: dirpath => {
        /** @type {FileData[]} */ const out = []

        if (!fs.existsSync(dirpath)) return out

        function walkSync(curdirpath) {
            const dirs = fs.readdirSync(curdirpath)
            for (const name of dirs) {
                const filePath = path.join(curdirpath, name)
                const stat = fs.statSync(filePath)
                if (stat.isFile()) {
                    const p = path.parse(filePath)
                    const dirRelative = path.relative(dirpath, p.dir)
                    const baseRelative = path.join(dirRelative, p.base)
                    const file = path.join(p.dir, p.base)

                    const fd = /** @type {FileData} */{
                        ...p,
                        baseRelative,
                        baseRelativeLC: baseRelative.toLowerCase(),
                        dirRelative,
                        file,
                    }
                    out.push(fd)
                } else if (stat.isDirectory()) {
                    walkSync(filePath)
                }
            }
        }

        walkSync(dirpath)

        return out
    },

    getModelTextures: file => {
        if (!fs.existsSync(file.file)) return []
        try {
            return getModelTextures(file)
        } catch (e) {
            return []
        }
    },

    setModelTextures: (file, textures) => {
        if (!fs.existsSync(file.file)) return
        try {
            setModelTextures(file, textures)
        } catch (e) { /* empty */
        }
    }
}

module.exports = reader
