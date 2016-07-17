/// <reference path="../typings/index.d.ts" />

import nav from './nav';
import overlays from './overlays';
import heros from './heros';
import buttons from './buttons';
import testimonials from './testimonials';
import zoomer from './zoomer';
import scrolled from './scrolled';

const scroll = require('smooth-scroll');

scroll.init();

if (document.body.classList.contains('page-contact')) {
    require.ensure([], function () {
        const book = require('./book').default;
        book();
    });
}

nav();
overlays();
scrolled();
heros();
buttons();
testimonials();
zoomer();
