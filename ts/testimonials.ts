import state from './state';

export default function () {

    if (state.aboveLap) {
        return;
    }
    
    const Flickity = require('./vendor/flickity');
    const flickity = new Flickity('.cards', {
        // wrapAround: true,
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
}
