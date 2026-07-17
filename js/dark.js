// dark.js
class DarkModeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          cursor: pointer;
          position: fixed;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 1000;
        }
        button {
          background: transparent;
          border: none;
          color: #f8333c;
          font-size: 1.5rem;
          cursor: pointer;
        }
      </style>
      <button aria-label="Toggle dark mode">🌓</button>
    `;
    this.button = this.shadowRoot.querySelector('button');
    this.button.addEventListener('click', () => this.toggleDarkMode());
    this.checkInitialMode();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
  }

  checkInitialMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      document.body.classList.add('dark');
    }
  }
}

customElements.define('dark-mode-toggle', DarkModeToggle);
