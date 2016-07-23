require('zepto/zepto.min.js');
const $ = window['Zepto'];
import state from './state';

export const HeroAttributes = {
    loadingClass: 'hero--loading',
    srcAttr: <any>'hero-src',
    largeAttr: <any>'hero-src-large',
};

export interface HeroItem {
    $elem: any,
    src: any,
    large: string,
    current: string
}

export default function init () {


    function hasHtml5Validation () {
        return typeof document.createElement('input').checkValidity === 'function';
    }

    if (hasHtml5Validation()) {
        $('.validate-form').submit(function (e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                $(this).addClass('invalid');
                // $('#status').html('invalid');
            } else {
                $(this).removeClass('invalid');
                // $('#status').html('submitted');
            }
        });
    }

    /**
     * Gather hero items on page load
     * @type {any}
     */
    const heros = $.map($('[hero-src]'), function (item): HeroItem {
        const $elem = $(item);
        const src = $elem.attr(HeroAttributes.srcAttr);
        const large = $elem.attr(HeroAttributes.largeAttr);
        return {    
            $elem,
            src: src,
            large: large,
            current: ''
        }
    });

    /**
     * If any hero items exist on page load
     */
    if (heros.length) {
        loadFromCollection(heros);
        $(window).resize(function () {
            loadFromCollection(heros);
        });
    }

    /**
     * Run the initial load
     */
    function loadFromCollection (collection) {
        if (!collection.length) return;
        load(collection[0], function () {
            collection.slice(1).forEach(load);
        });
    }

    function load(item, cb) {
        cb = cb || function() {};

        const selection = (function () {
            if (state.aboveLap) return item.large;
            return item.src;
        })();

        if (item.current && item.current === selection) {
            // debug(`BAIL ${item.current}`);
            return cb();
        }

        const img = $(`<img src="${selection}"/>`);


        img[0].onload = function () {
            console.log('added');
            img.remove();
            item.current = selection;
            item.$elem.parent().removeClass(HeroAttributes.loadingClass);
            item.$elem.css('background-image', `url(${selection})`);
            cb();
        };
    }
}
