/**
 * @typedef {Object} reader
 * @property {function(string): Promise<FileData[]>} getDirectoryFilesList
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

/** */
const fs = require('fs')
const path = require('path')

const reader = {
    /**
     * @param {string} dirpath
     * @returns {FileData[]}
     */
    getDirectoryFilesList: async dirpath => {
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
    }
}

module.exports = reader
