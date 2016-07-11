const choo = require('choo');
const html = require('choo/html');
const container = document.querySelector('#app-container');

export default function () {
    const app = choo();

    app.model({
        state: {
            title: 'Set the title'
        },
        reducers: {
            update: (action, state) => ({ title: action.value })
        }
    });

    const mainView = (state, params, send) => {
        return html`
      <main class="wrapper">
        <div class="container">
            <h1>${state.title}-shas</h1>
            <input type="text"
              oninput=${(e) => send('update', { value: e.target.value })}>
        </div>  
      </main>
    `;
    }

    app.router((route) => [
        route('/', mainView)
    ]);

    const tree = app.start();

    document.body.appendChild(tree);
}

