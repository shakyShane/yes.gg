import {type} from "os";
const choo      = require('choo');
const html      = require('choo/html');

import {ServiceExtra, ServiceSend, ServiceAction, SelectedExtra} from "../book";

export default function createSelectableExtra(extra: ServiceExtra, state: any, send: ServiceSend) {

    const current               = state.service.extras.filter(x => x.id === extra.id)[0];
    const isSelected            = state.service.selectedExtras.indexOf(extra.id) > -1;
    const action: ServiceAction = isSelected ? "service:extra.remove" : "service:extra.select";
    const extraElement          = (function () {
        if (extra.price.type === 'toggle') {
            return toggleExtra(extra, action, send);
        }
        if (extra.price.type === 'info') {
            return infoExtra(extra, action, send);
        }
        if (extra.price.type === 'qty') {
            return qtyExtra(extra, current, action, send);
        }
    })();
    const typeClass = extra.price.type;

    return html`<li class="extras__item extras__item--type-${typeClass} ${isSelected ? 'extras__item--selected' : ''}">${extraElement}</li>`;
}

/**
 * Extras that can be on or off
 * @param extra
 * @param action
 * @param send
 * @returns {any}
 */
function qtyExtra(extra, current: SelectedExtra, action, send) {
    return html`
<div>
    <div 
        class="extras__item-button" 
        onclick=${(e) => send(action, extra.id)}>
        ${extra.content}
        <span class="extras__item-price">£${extra.price.value.toFixed(2)}</span>
    </div>
    <div class="extras__item-qty qty">
        <button type="button" class="qty__button qty__button--inc" onclick=${e => send('service:extra.inc', extra.id)}>+</button>
        <span class="qty__text">${current.qty}</span>
        <button type="button" class="qty__button qty__button--dec" onclick=${e => send('service:extra.dec', extra.id)}>-</button>
    </div>
</div>
`
}

/**
 * Extras that can be on or off
 * @param extra
 * @param action
 * @param send
 * @returns {any}
 */
function toggleExtra(extra, action, send) {
    return html`
<div 
    class="extras__item-button" 
    onclick=${(e) => send(action, extra.id)}>
    ${extra.content}
    <span class="extras__item-price">£${extra.price.value.toFixed(2)}</span>
</div>`
}

/**
 * Extras that don't need a price (ie: just info)
 * @param extra
 * @param action
 * @param send
 * @returns {any}
 */
function infoExtra (extra, action, send) {
    return html`
<button type="button"
        class="extras__item-button" 
        onclick=${(e) => send(action, extra.id)}>
        ${extra.content}
</button>`
}
