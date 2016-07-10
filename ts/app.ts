/// <reference path="../typings/index.d.ts" />

import nav from './nav';
import overlays from './overlays';
import heros from './heros';
import buttons from './buttons';
import testimonials from './testimonials';
import zoomer from './zoomer';
const scroll = require('smooth-scroll');

scroll.init();

nav();
overlays();
heros();
buttons();
testimonials();

zoomer();
