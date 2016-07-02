require('zepto/zepto.min.js');
const $ = window['Zepto'];

// const siteConfig = require('./site.config.ts');
const selectors = {
    $triggers: '[class-toggle]'
};

const sections = [
    'site-nav--open',
    'site-search--open',
    'minicart--open',
    'user-nav--open'
];

/**
 * @returns {*}
 */
export default function () {
    const $triggers = $(selectors.$triggers);
    const $body     = $('body');

    $triggers.on('click', function () {
        const target = $(this).attr('class-toggle');
        var state = $(this).hasClass('active');

        $(this).blur();

        if (state) {
            $(document).trigger('overlay:close', {target, elem: $(this)});
        } else {
            $(document).trigger('overlay:open', {target, elem: $(this)});
        }

        $(this).toggleClass('active');
        $(this).siblings().removeClass('active');
        $body.toggleClass(target);
        $body.removeClass(sections.filter(x => x !== target).join(' '))
    });
}
