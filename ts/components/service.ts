import createSelectableExtra from "./extra";
const choo      = require('choo');
const html      = require('choo/html');
import {ServiceSend, Service} from "../book";

/**
 * Display a service with add/remove buttons
 */
export default function createSelectableService(service: Service, selected: string[], state: any, send: ServiceSend) {

    const isSelected = selected.indexOf(service.id) > -1;
    const extras     = service.extras;
    const hasExtras  = extras.length;

    console.log(service.price.type, service.title);

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
