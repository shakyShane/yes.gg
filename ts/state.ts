require('zepto/zepto.min.js');
const $ = window['Zepto'];

export enum Breakpoints {
    Hero = 640
}

let hasMouse = false;
let aboveLap = $(window).width() >= Breakpoints.Hero;

const mediaCheck = require('./vendor/match-media');

mediaCheck({
    media: '(max-width: 640px)',
    entry: function() {
        aboveLap = false;
        $(document).trigger('state:change', {aboveLap, hasMouse});
    },
    exit: function() {
        aboveLap = true;
        $(document).trigger('state:change', {aboveLap, hasMouse});
    },
    both: function () {
        // setNavHeight($(window).height());
    }
});

let _mouseMoveTimeout;
var onFirstMouseMove = function () {
    if(_mouseMoveTimeout ) {
        $(document).off('mousemove', onFirstMouseMove);
        $('body').addClass('has-mouse');
        hasMouse = true;
        $(document).trigger('state:change', {aboveLap, hasMouse});
    }
    _mouseMoveTimeout = setTimeout(function() {
        _mouseMoveTimeout = null;
    }, 100);
};
$(document).on('mousemove', onFirstMouseMove);

let state: any = {};

Object.defineProperties(state, {
    'hasMouse': {
        get: () => hasMouse
    },
    'aboveLap': {
        get: () => aboveLap
    }
});

export default state;
