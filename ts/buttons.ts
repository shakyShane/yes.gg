require('zepto/zepto.min.js');
const $ = window['Zepto'];

export default function () {
    $('a.button').on('click', function (e) {
        e.preventDefault();
        const $this = $(this);
        $this.addClass('link--disabled');
        setTimeout(function () {
            window.location = $this[0].href;
        }, 500);
    })
}
