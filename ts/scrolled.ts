require('zepto/zepto.min.js');
const $ = window['Zepto'];
const $body = $('body');
const scrollThreshold = 95 + 30;

export default function scrolled() {
    $(window).scroll(function () {
        const y = window.pageYOffset || document.scrollTop;
        if (!y) {
            $body.removeClass('scrolled');
        } else {
            if (y < scrollThreshold) {
                $body.removeClass('scrolled');
            } else {
                $body.addClass('scrolled');
            }
        }
    });
}
