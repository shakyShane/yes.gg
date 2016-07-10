require('zepto/zepto.min.js');
const $ = window['Zepto'];

const PhotoSwipe = require('photoswipe');
const PhotoswipeUIDefault = require('photoswipe/dist/photoswipe-ui-default');

export default function () {
    const $linkItems = $('.gallery__link');

    if (!$linkItems.length) return;

    const items = $.map($('.gallery__link'), function (elem) {
        return {
            src: $(elem).attr('href'),
            h: Number($(elem).attr('data-height')),
            w: Number($(elem).attr('data-width'))
        }
    });

    $('.gallery').on('click', '.gallery__link', function (evt) {
        evt.preventDefault();
        const index = $linkItems.indexOf(this);
        initGallery(items, index, this);
    });
}

function initGallery (items, index, elem) {
    const gallery = new PhotoSwipe(
        document.querySelector('.pswp'),
        PhotoswipeUIDefault,
        items,
        {
            index: index,
            showHideOpacity: true,
            getThumbBoundsFn: function(index) {

                // find thumbnail element

                // get window scroll Y
                var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
                // optionally get horizontal scroll

                // get position of element relative to viewport
                var rect = elem.getBoundingClientRect();

                // w = width
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        }
    );
    gallery.init();
}

