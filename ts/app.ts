/// <reference path="../typings/index.d.ts" />

import nav from './nav';
import overlays from './overlays';
import heros from './heros';
import buttons from './buttons';

nav();

overlays();
heros();
buttons();

const Flickity = require('./vendor/flickity');
const flickity = new Flickity('.cards', {
    wrapAround: true,
    arrowShape: {
        x0: 30,
        x1: 60, y1: 30,
        x2: 60, y2: 20,
        x3: 40
    },
    // setGallerySize: false,
    // pageDots: false,
    // lazyLoad: 1,
    touchVerticalScroll: false,
    dragThreshold: 10
});
