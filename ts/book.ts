import {ServiceGroups, ServiceGroup} from "./data";
const choo      = require('choo');
const html      = require('choo/html');
const container = document.querySelector('#app-container');
import getData from './data';
import createSelectableService from "./components/service";

export type PriceTypes    = "qty" | "toggle";
export type ServiceAction =
    "service:select"       | "service:remove"      |
    "service:qty.inc"      | "service:qty.dec"     |
    "service:extra.inc"    | "service:extra.dec"   |
    "service:extra.select" | "service:extra.remove";

export type SendFn        = (action: string, params?: any) => void;
export type ServiceSend   = (action: ServiceAction, id: string) => void;
export type MainView      = (state: AppState, prev: any, send: SendFn) => Function;

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

export interface SelectedExtra {
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

function qtyExtra(state: ServiceState, id: string, qty: number) {
    return state.extras
        .map(x => {
            if (x.id === id) {
                x.qty = Number(qty);
                x.subtotal = x.qty * x.price.value;
            }
            return x;
        });
}

function decExtra(state: ServiceState, id: string) {
    return state.extras
        .map(x => {
            if (x.id === id) {
                if (x.qty > 1) {
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

    const extrasCollection = servicesCollection.reduce((acc, item) => {
        return acc.concat(item.extras);
    }, []);

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
            },
            'extra.qty': (data: {id: string, qty: number}, state: ServiceState) => {
                const extras = qtyExtra(state, data.id, data.qty);
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
        <div class="service__group">
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
        <section>
            <div class="booking-form__inputs services">
                <label for="" class="label">Which services are you interested in? <span>(optional)</span></label>
                ${Object.keys(ns.services).map(x => createGroup(ns.services[x], ns.selected, state, send))}
            </div>
            <div class="booking-form__summary">
                <div class="summary">
                    <p class="summary__total">Total: <strong>£${total.toFixed(2)}</strong></p>
                    ${!selected.length ? html`<p class="summary__help">Select the services you're interested in (optional)</p>` : ''}
                    <ul class="summary__items">
                        ${selected.map(service => {
                            return html`<li class="summary__item">
                                ${service.title}
                                ${getExtras(service, ns.selectedExtras, ns.extras).map(extra => {
                                    return html`<span class="summary__extra">${extra.raw.title} (${extra.qty})</span>`
                                })}
                            </li>`
                        })}
                    </ul>
                </div>
            </div>
            ${selected.map(service => {
                return html`<div>
                      <input name=${service.title} type="hidden" value="Selected" />
                      ${getExtras(service, ns.selectedExtras, ns.extras).map(extra => {
                            return html`<input name="${extra.title}" type="hidden" value=${extra.value} />`      
                        })}
                </div>`
            })}
            ${selected.length ? html`<input name="Total:" type="hidden" value=${total} />` : ''}
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

function getExtras (service, selectedExtras, extras) {
    const serviceExtras = service.extras;
    return serviceExtras.filter(x => {
        return selectedExtras.indexOf(x.id) > -1;
    }).map(extra => {
        const qty = extras.filter(x => x.id === extra.id)[0].qty;
        return {
            raw: extra,
            qty,
            title: `${service.title} - ${extra.title}`,
            value: `Quantity: ${qty}`
        }
    })
}
