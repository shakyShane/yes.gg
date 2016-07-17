import {ServiceGroups, ServiceGroup} from "./data";
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
    services: ServiceGroups
    selected: Array<number>
}

export interface Price {
    value: number
    content: string
    additional: Price
}

export interface ServiceExtra {
    content: string
    price: Price
}

export interface ServiceExtras {
    [name: string]: ServiceExtra
}

export interface Service {
    title: string
    price: Price
    selected: boolean
    id: number
    extras: ServiceExtras
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

    function getServices(services: ServiceGroups): Service[] {
        return Object.keys(services).reduce(function (acc, key: string) {
            const current: ServiceGroup = services[key];
            return acc.concat(current.items);
        }, []);
    }

    function createGroup (serviceGroup: ServiceGroup, selected: number[], send: SendFn) {
        return html`
        <div class="">
            <h1>${serviceGroup.title}</h1>
            ${serviceGroup.items.map(item => createSelectableService(item, selected, send))}
        </div>
`;
    }

    const mainView: MainView = (state, prev, send) => {

        const ns                = state.service;
        const flattenedServices = getServices(ns.services);
        const selected          = flattenedServices.filter(x => (ns.selected.indexOf(x.id) > -1));
        const total             = selected.reduce((acc, item) => acc + item.price.value, 0);

        return html`
        <main class="wrapper service-select ${selected.length ? 'service-select--active' : ''}">
            <div class="container">
                <div class="services">
                    <h2>Select which Services you're interested in:</h2>
                    ${Object.keys(ns.services).map(x => createGroup(ns.services[x], ns.selected, send))}
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

function createExtras(service: Service, send: ServiceSend) {

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

    const isSelected = selected.indexOf(service.id) > -1;
    const hasExtras  = Object.keys(service.extras).length > 0;
    // console.log(service.extras);
    return html`
    <div class="service ${isSelected ? 'service--selected' : ''}">
        <button class="service__button"
            type="button"
            onclick=${(e) => send(isSelected ? 'service:remove' : 'service:select', service.id)}>
            ${service.title} <span class="service__price">£${service.price.value.toFixed(2)}</span>
        </button>
        <p>Extras: ${hasExtras}</p>
    </div>
`
}
