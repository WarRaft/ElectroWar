/** @typedef {import('/main/utils/reader.js').FileData} FileData */
/** @typedef {import('/main/utils/reader.js').TextureData} TextureData */

export class ModelTextureModel extends HTMLElement {
    constructor() {
        super()

        this.#shadow = this.attachShadow({mode: 'open'})
        this.#shadow.adoptedStyleSheets = [ModelTextureModel.sheet]
    }

    /** @type {ShadowRoot} */ #shadow
    /** @type {FileData} */ #file
    /** @type {HTMLElement} */ #texturesDom
    /** @type {TextureData[]} */ #texturesList

    /** @param {FileData} file */
    set file(file) {
        this.#file = file
        const name = document.createElement('div')
        name.textContent = file.baseRelative
        this.#shadow.appendChild(name)

        this.#texturesDom = document.createElement('div')
        this.#texturesDom.classList.add('inner')
        this.#shadow.appendChild(this.#texturesDom)

        this.#read()
    }

    async start() {
        this.#texturesDom.textContent = ''
        await window.reader.setModelTextures(this.#file, this.#texturesList)
        await this.#read()
    }

    async #read() {
        this.#texturesList = await window.reader.getModelTextures(this.#file)

        if (this.#texturesList.length === 0) {
            const div = document.createElement('div')
            div.innerHTML = '<div class="inner"><b class="error">Error!</b> Textures not found.</div>'
            this.#texturesDom.appendChild(div)
            return
        }

        const prefix = 'war3mapImported\\'
        for (const texture of this.#texturesList) {
            const div = document.createElement('div')
            div.classList.add('inner')
            if (texture.name.startsWith(prefix)) {
                div.insertAdjacentHTML('beforeend', `<b class="error">${prefix}</b>`)
                texture.name = texture.name.substring(prefix.length)
                texture.nameLC = texture.name.toLowerCase()
            }

            const span = document.createElement('span')
            span.textContent = texture.name
            div.appendChild(span)
            this.#texturesDom.appendChild(div)
        }
    }

    static #sheet

    static get sheet() {
        if (ModelTextureModel.#sheet) return ModelTextureModel.#sheet
        ModelTextureModel.#sheet = new CSSStyleSheet()

        ModelTextureModel.sheet.replaceSync(
            //language=CSS
            `
                /*noinspection CssUnusedSymbol*/
                .inner {
                    padding-left: 1rem;
                }

                /*noinspection CssUnusedSymbol*/
                .error {
                    --color: #940e0e;
                    color: var(--color);
                    text-shadow: none;
                }
            `)

        return ModelTextureModel.#sheet
    }
}

customElements.define('model-texture-model', ModelTextureModel)
