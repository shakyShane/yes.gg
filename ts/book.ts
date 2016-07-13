const choo      = require('choo');
const html      = require('choo/html');
const container = document.querySelector('#app-container');
import getData from './data';

type ServiceAction = "service:select" | "service:remove";
type SendFn        = (action: string, params?: any) => void;
type ServiceSend   = (action: ServiceAction, id: number) => void;
type MainView      = (state: AppState, prev: any, send: SendFn) => Function;

export interface AppState {
    location: any
    params: any
    service: ServiceState
}

export interface ServiceState {
    services: Array<Service>
    selected: Array<number>
}

export interface Price {
    value: number
    content: string
    additional: Price
}

export interface Service {
    title: string
    price: Price
    selected: boolean
    id: number
}

export default function () {

    const app = choo();

    app.model({
        namespace: 'service',
        state: <ServiceState>{
            selected: [],
            services: getData()
        },
        reducers: {
            select: (id: number, state: ServiceState) => {
                return {
                    selected: state.selected.concat(id)
                };
            },
            remove: (id: number, state: ServiceState) => {
                return {
                    selected: state.selected.filter(x => x !== id)
                };
            },
        }
    });

    const mainView: MainView = (state, prev, send) => {

        const service  = state.service;
        const selected = service.services.filter(x => (service.selected.indexOf(x.id) > -1));
        const total    = selected.reduce((acc, item) => acc + item.price.value, 0);

        return html`
      <main class="wrapper service-select ${selected.length ? 'service-select--active' : ''}">
        <div class="container">
            <div class="services">
                <h2>Select which Services you're interested in:</h2>
                <div>
                    ${service.services.map(item => createSelectableService(item, service.selected, send))}
                </div>
            </div>
            <div class="summary">
                <p>You've Selected: ${selected.length} service${selected.length === 1 ? '': 's'}</p>
                <p>The price would be <strong>£${total.toFixed(2)}</strong></p>
                <ul hidden>${selected.map(item => createSelectedService(item, send))}</ul>
            </div>
        </div>  
      </main>
    `;
    }

    app.router((route) => [
        route('/', mainView,
            route('/contact', mainView

            )
        )
    ]);

    const tree = app.start({href: false});

    container.appendChild(tree);
}

/**
 * Create Selected Service
 * @param service
 * @param send
 * @returns {any}
 */
function createSelectedService (service: Service, send: ServiceSend) {
    return html`<li>${service.title}</li>`;
}

/**
 * Display a service with add/remove buttons
 * @param service
 * @param send
 * @returns {any}
 */
function createSelectableService(service: Service, selected: number[], send: ServiceSend) {
    console.log(service);
    const isSelected = selected.indexOf(service.id) > -1;
    return html`
    <div class="service ${isSelected ? 'service--selected' : ''}">
        <button class="service__button"
            type="button"
            onclick=${(e) => send(isSelected ? 'service:remove' : 'service:select', service.id)}
        >${service.title} <span class="service__price">£${service.price.value.toFixed(2)}</span></button>
    </div>
`
}
