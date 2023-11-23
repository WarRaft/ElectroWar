export class AppTaskbar extends HTMLElement {
    static #sheet

    constructor() {
        super()

        const shadow = this.attachShadow({mode: 'open'})
        shadow.adoptedStyleSheets = [AppTaskbar.sheet]

        const slot = document.createElement('slot')
        shadow.appendChild(slot)
    }

    static get sheet() {
        if (AppTaskbar.#sheet) return AppTaskbar.#sheet
        AppTaskbar.#sheet = new CSSStyleSheet()

        // noinspection CssUnusedSymbol
        AppTaskbar.sheet.replaceSync(
            //language=CSS
            `
                :host {
                    font: 14px/20px USSRStencil;
                    font-size: 28px;
                    position: sticky;
                    z-index: 10;
                    top: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    margin-right: -1rem;
                    margin-left: -1rem;
                    -webkit-user-select: none;
                    text-align: center;
                    color: #27de4a;
                    background-color: #08321f;
                    text-shadow: none;
                    -webkit-app-region: drag;
                }
            `)

        return AppTaskbar.#sheet
    }
}

customElements.define('app-taskbar', AppTaskbar)
