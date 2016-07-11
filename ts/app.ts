/// <reference path="../typings/index.d.ts" />

import nav from './nav';
import overlays from './overlays';
import heros from './heros';
import buttons from './buttons';
import testimonials from './testimonials';
import zoomer from './zoomer';
import book from './book';

const scroll = require('smooth-scroll');

scroll.init();

book();

nav();
overlays();
heros();
buttons();
testimonials();

zoomer();
