import {ButtonLink} from '../components/button-link.mjs'

/** @typedef {import('/main/reader/reader.js').reader} reader */

export class ModelTexturePathClean extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({mode: 'open'})
        shadow.adoptedStyleSheets = [ModelTexturePathClean.sheet]

        const buttons = document.createElement('div')
        buttons.classList.add('buttons')
        shadow.appendChild(buttons)

        /**
         *  @param {string} name
         *  @return {ButtonLink}
         */
        const btn = name => {
            const btn = new ButtonLink()
            btn.innerHTML = name
            btn.disabled = true
            buttons.appendChild(btn)
            return btn
        }

        this.#uploadBtn = btn('Select folder')
        this.#clearBtn = btn('Clear')
        this.#startBtn = btn('Start')

        this.#uploadBtn.addEventListener('click', async () => {
            const electron = window.electron
            const paths = await electron.showOpenDialogSync({
                title: 'Select model root directory',
                buttonLabel: 'Open',
                properties: ['openDirectory'],
            })

            if (!paths) return
            await this.readDir(paths[0])
        })

        this.#uploadBtn.disabled = false

        /*
<div class="files pre"></div>
<div class="process pre"></div>
         */

        // eslint-disable-next-line no-constant-condition
        if (1) {
            this.readDir('/Users/nazarpunk/Downloads/HY_zs_weilan')
        }
    }

    async readDir(dirpath) {
        const list = await window.reader.getDirectoryFilesList(dirpath)
        for (const file of list) {
            console.log(file)
        }
    }

    /** @type {ButtonLink} */ #uploadBtn
    /** @type {ButtonLink} */ #clearBtn
    /** @type {ButtonLink} */ #startBtn

    static #sheet

    static get sheet() {
        if (ModelTexturePathClean.#sheet) return ModelTexturePathClean.#sheet
        ModelTexturePathClean.#sheet = new CSSStyleSheet()

        // noinspection CssUnusedSymbol
        ModelTexturePathClean.sheet.replaceSync(
            //language=CSS
            `
                :host {
                    max-width: 100%;
                    display: flex;
                    justify-content: center;
                }

                .buttons {
                    display: flex;
                    gap: 1rem;
                    width: 100%;
                    padding: 0 1rem;
                    flex-wrap: wrap;
                }

                .buttons > button-link:first-child {
                    flex-grow: 1;
                }

            `)

        return ModelTexturePathClean.#sheet
    }
}

customElements.define('model-texture-path-clean', ModelTexturePathClean)
