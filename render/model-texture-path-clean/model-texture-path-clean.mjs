import {ButtonLink} from '../components/button-link.mjs'
import {ModelTextureModel} from './model-texture-model.mjs'

/** @typedef {import('/main/utils/reader.js').reader} reader */

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
            //btn.disabled = true
            buttons.appendChild(btn)
            return btn
        }

        this.#uploadBtn = btn('Select folder')
        this.#clearBtn = btn('Clear')
        this.#startBtn = btn('Start')

        this.#models = document.createElement('div')
        this.#models.classList.add('models')
        shadow.appendChild(this.#models)

        // upload
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
        //this.#uploadBtn.disabled = false

        // clear
        this.#clearBtn.addEventListener('click', () => {
            this.#models.textContent = ''
        })

        this.#startBtn.addEventListener('click', () => {
            const textures = /** @type {NodeListOf<ModelTextureModel>} */ shadow.querySelectorAll('model-texture-model')
            for (const texture of textures) {
                texture.start()
            }
        })

        // eslint-disable-next-line no-constant-condition
        if (1) {
            this.readDir('/Users/nazarpunk/Downloads/HY_zs_weilan1')
        }
    }

    async readDir(dirpath) {
        const list = await window.reader.getDirectoryFilesList(dirpath)
        const h = document.createElement('h1')
        h.textContent = dirpath
        this.#models.appendChild(h)

        let empty = true

        for (const file of list) {
            if (file.ext !== '.mdx') continue
            empty = false
            const model = new ModelTextureModel()
            model.classList.add('inner')
            model.file = file
            this.#models.appendChild(model)
        }

        if (empty) this.#models.insertAdjacentHTML('beforeend', '<div class="inner"><b class="error">Error!</b> The folder does not contain any models.</div>')

    }

    /** @type {ButtonLink} */ #uploadBtn
    /** @type {ButtonLink} */ #clearBtn
    /** @type {ButtonLink} */ #startBtn
    /** @type {HTMLElement} */ #models

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
                    flex-direction: column;
                    justify-content: center;
                    gap: 1rem;
                }

                .buttons {
                    display: flex;
                    gap: 1rem;
                    width: 100%;
                    padding: 0 1rem;
                    flex-wrap: wrap;
                    box-sizing: border-box;
                }

                .buttons > button-link:first-child {
                    flex-grow: 1;
                }

                .models {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    padding: 0 1rem;
                }

                h1 {
                    margin: 0;
                    font-size: 18px;
                }

                .inner {
                    padding-left: 1rem;
                }

                .error {
                    --color: #940e0e;
                    color: var(--color);
                    text-shadow: none;
                }

            `)

        return ModelTexturePathClean.#sheet
    }
}

customElements.define('model-texture-path-clean', ModelTexturePathClean)
