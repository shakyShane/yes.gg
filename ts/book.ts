import {ServiceGroups, ServiceGroup} from "./data";
const choo      = require('choo');
const html      = require('choo/html');
const container = document.querySelector('#app-container');
import getData from './data';

type PriceTypes    = "qty" | "toggle";
type ServiceAction = "service:select" | "service:remove" | "service:extra.inc" | "service:extra.dec" | "service:extra.select" | "service:extra.remove";
type SendFn        = (action: string, params?: any) => void;
type ServiceSend   = (action: ServiceAction, id: string) => void;
type MainView      = (state: AppState, prev: any, send: SendFn) => Function;

export interface AppState {
    location: any
    params: any
    service: ServiceState
}

export interface ServiceState {
    services: ServiceGroups
    selected: string[]
    selectedExtras: string[]
    extras: SelectedExtra[]
    extrasCollection: ServiceExtra[]
    servicesCollection: Service[]
}

export interface Price {
    value: number
    content: string
    additional: Price
    type: PriceTypes
}

export interface ServiceExtra {
    title: string
    content: string
    price: Price
    id: string
}

export interface Service {
    title: string
    price: Price
    selected: boolean
    id: string
    extras: ServiceExtra[]
}

interface SelectedExtra {
    id: string
    qty: number
    subtotal: number
    price: Price
}

function incExtra(state: ServiceState, id: string) {
    return state.extras
        .map(x => {
            if (x.id === id) {
                x.qty++;
                x.subtotal = x.qty * x.price.value;
            }
            return x;
        });
}

function decExtra(state: ServiceState, id: string) {
    return state.extras
        .map(x => {
            if (x.id === id) {
                if (x.qty > 0) {
                    x.qty--;
                    x.subtotal = x.qty * x.price.value;
                }
            }
            return x;
        });
}
export default function () {

    const app = choo();
    const namedServices = getData();
    const servicesCollection = getServices(namedServices);
    const extrasCollection = servicesCollection.reduce((acc, item) => acc.concat(item.extras), []);
    const extras: SelectedExtra[] = extrasCollection.map(x => {
        return {
            id: x.id,
            qty: 0,
            subtotal: 0,
            price: x.price
        }
    });

    app.model({
        namespace: 'service',
        state: <ServiceState>{
            selected: [],
            selectedExtras: [],
            extras,
            extrasCollection,
            servicesCollection,
            services: namedServices
        },
        reducers: {
            select: (id: string, state: ServiceState) => {
                return {
                    selected: state.selected.concat(id)
                };
            },
            remove: (id: string, state: ServiceState) => {
                return {
                    selected: state.selected.filter(x => x !== id)
                };
            },
            'extra.remove': (id: string, state: ServiceState) => {
                return {
                    selectedExtras: state.selectedExtras.filter(x => x !== id)
                };
            },
            'extra.select': (id: string, state: ServiceState) => {
                return {
                    selectedExtras: state.selectedExtras.concat(id),
                    extras: state.extras.map(function (extra) {
                        if (extra.id === id) {
                            if (extra.qty === 0) {
                                extra.qty = 1;
                                extra.subtotal = extra.qty * extra.price.value;
                            }
                        }
                        return extra;
                    })
                };
            },
            'extra.inc': (id: string, state: ServiceState) => {
                const extras = incExtra(state, id);
                return {extras}
            },
            'extra.dec': (id: string, state: ServiceState) => {
                const extras = decExtra(state, id);
                return {extras}
            }
        }
    });

    function getServices(services: ServiceGroups): Service[] {
        return Object.keys(services).reduce(function (acc, key: string) {
            const current: ServiceGroup = services[key];
            return acc.concat(current.items);
        }, []);
    }

    function createGroup (serviceGroup: ServiceGroup, selected: string[], state, send: SendFn) {
        return html`
        <div class="service">
            <h1>${serviceGroup.title}</h1>
            ${serviceGroup.items.map(item => createSelectableService(item, selected, state, send))}
        </div>
`;
    }

    const mainView: MainView = (state, prev, send) => {

        const ns                = state.service;
        const flattenedServices = getServices(ns.services);
        const selected          = flattenedServices.filter(x => (ns.selected.indexOf(x.id) > -1));

        const serviceTotal      = selected.reduce((acc, item) => {
            return acc + item.price.value;
        }, 0);

        const extrasTotal       = ns.extras.reduce((acc, item) => {
            if (ns.selectedExtras.indexOf(item.id) > -1) {
                const parentId = item.id.split('.')[0];
                const parent = flattenedServices.filter(x => x.id === parentId)[0];
                if (ns.selected.indexOf(parent.id) > -1) {
                    return acc + item.subtotal;
                }
            }
            return acc;
        }, 0);

        const total = serviceTotal + extrasTotal;

        return html`
        <section class="booking-form">
            <div class="booking-form__summary summary">
                <p>You've Selected: ${selected.length} service${selected.length === 1 ? '': 's'}</p>
                <p>The price would be <strong>£${total.toFixed(2)}</strong></p>
                <ul hidden>${selected.map(item => createSelectedService(item, state, send))}</ul>
            </div>
            <div class="booking-form__inputs services">
                ${Object.keys(ns.services).map(x => createGroup(ns.services[x], ns.selected, state, send))}
            </div>
        </section>
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
function createSelectedService (service: Service, state: any, send: ServiceSend) {
    return html`<li>${service.title}</li>`;
}

function createSelectableExtra(extra: ServiceExtra, state: any, send: ServiceSend) {
    const current               = state.service.extras.filter(x => x.id === extra.id)[0];
    const isSelected            = state.service.selectedExtras.indexOf(extra.id) > -1;
    const action: ServiceAction = isSelected ? "service:extra.remove" : "service:extra.select";

    return html`
<li class="extras__item ${isSelected ? 'extras__item--selected' : ''}">
    <button type="button" 
        class="extras__item-button" 
        onclick=${(e) => send(action, extra.id)}>
        ${extra.content}
        <span class="extras__item-price">£${extra.price.value.toFixed(2)}</span>
    </button>
</li>`;
}
/**
 * Display a service with add/remove buttons
 * @param service
 * @param send
 * @returns {any}
 */
function createSelectableService(service: Service, selected: string[], state: any, send: ServiceSend) {

    const isSelected = selected.indexOf(service.id) > -1;
    const extras     = service.extras;
    const hasExtras  = extras.length;

    return html`
    <div class="service ${isSelected ? 'service--selected' : ''} ${hasExtras ? 'service--has-extras' : ''}">
        <button class="service__button"
            type="button"
            onclick=${(e) => send(isSelected ? 'service:remove' : 'service:select', service.id)}>
            ${service.title}
            <span class="service__price">£${service.price.value.toFixed(2)}</span>
        </button>
        <div class="extras">
            <p class="extras__title">
                Would you like any additional Extras?
            </p>
            <ul class="extras__items" ${!hasExtras ? 'hidden' : ''}>
                ${extras.map(extra => createSelectableExtra(extra, state, send))}
            </ul>
        </div>
    </div>
`
}
