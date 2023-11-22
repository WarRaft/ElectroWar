// noinspection CssUnresolvedCustomProperty,CssInvalidPropertyValue,CssReplaceWithShorthandSafely

export class ButtonLink extends HTMLElement {
    constructor() {
        super()

        this.#shadow = this.attachShadow({mode: 'open'})
        this.#shadow.adoptedStyleSheets = [ButtonLink.sheet]

        const slot = document.createElement('slot')
        this.#shadow.appendChild(slot)
    }

    /** @type {ShadowRoot} */ #shadow

    /** @param {boolean} value */ set disabled(value) {
        if (value) this.setAttribute('disabled', '')
        else this.removeAttribute('disabled')
    }

    static #sheet

    static get sheet() {
        if (ButtonLink.#sheet) return ButtonLink.#sheet
        ButtonLink.#sheet = new CSSStyleSheet()

        // noinspection CssUnusedSymbol
        ButtonLink.sheet.replaceSync(
            //language=CSS
            `
                :host {
                    --border: 1px;
                    --slant: 10px;

                    text-align: center;
                    display: flex;
                    align-items: center;
                    font: var(--font);
                    padding: 6px 12px;
                    cursor: pointer;
                    user-select: none;
                    transition: color var(--t, 0.3s), background-size 0.3s;
                    text-transform: uppercase;
                    color: var(--color);
                    border: none;
                    background: linear-gradient(to bottom left, var(--color) 50%, #0000 50.1%) top right,
                    linear-gradient(to top right, var(--color) 50%, #0000 50.1%) bottom left;
                    background-repeat: no-repeat;
                    background-size: calc(var(--slant) + 1.3 * var(--border)) calc(var(--slant) + 1.3 * var(--border));
                    box-shadow: 0 0 0 200px inset var(--s, #0000), 0 0 0 var(--border) inset var(--color);
                    text-shadow: var(--text-shadow);
                    appearance: none;
                    clip-path: polygon(0 0, calc(100% - var(--slant)) 0, 100% var(--slant), 100% 100%, var(--slant) 100%, 0 calc(100% - var(--slant)));
                }

                :host(:focus-visible) {
                    outline: var(--border) solid #000c;
                    outline-offset: calc(-1 * var(--border));
                    background-size: 0 0;
                    clip-path: none;
                }
                :host(:hover),
                :host(:active) {
                    color: #000;
                    background-size: 100% 100%;
                    --t: 0.2s 0.1s;
                }
                :host(:active) {
                    transition: none;
                    --s: #0005;
                }

                :host([disabled]) {
                    pointer-events: none;
                    --color: rgb(128, 128, 128);
                }

            `)

        return ButtonLink.#sheet
    }
}

customElements.define('button-link', ButtonLink)
