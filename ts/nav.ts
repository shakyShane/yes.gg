require('zepto/zepto.min.js');
const $ = window['Zepto'];
import state from './state';

export default function () {
    /**
     * Track availability of mouse movements
     */
    var $mainNav    = $('#main-nav');
    var $body       = $('body');
    var $targets    = $('.subnav');
    var $triggers   = $('.site-nav__item--with-children');
    var subMenuOpen = false;
    var supportHover = true;
    var constants   = {
        ACTIVE: 'active',
        NAV_OPEN: 'nav-open'
    };

    /**
     * Toggle mobile menu
     */
    $('[data-menu-toggle]').click(toggleMobileMenu);

    /**
     * Toggle nav-overlay when on small screens
     */
    $('.nav-overlay').click(toggleMobileMenu);

    /**
     * Track clicks on the arrows & main link
     */
    $triggers.on('click', function (evt) {

        var $elem = $(this);
        var skip = false;

        $targets.each(function () {
            if (this.contains(evt.target) && !skip) {
                skip = true;
            }
        });

        if (skip) {
            return;
        }
        
        evt.preventDefault();

        /**
         * If Hover is not supported, always toggle
         */
        if (!supportHover) {
            if (state.aboveLap) {
                closeAllSubMenus();
            }
            toggleSubMenu(evt, $elem);
            return;
        }

        /**
         * finally if we're above lap and with no mouse,
         * always toggle
         */
        if (!state.hasMouse && state.aboveLap) {
            toggleSubMenu(evt, $elem);
        }
    });

    if (supportHover) {
        $triggers.on('mouseenter', function hoverIn() {
            if (state.hasMouse && state.aboveLap) {
                $(this).find('.subnav').addClass('active');
                $(this).addClass('active');
            }
        });
        $triggers.on('mouseleave', function hoverIn() {
            if (state.hasMouse && state.aboveLap) {
                closeAllSubMenus();
            }
        });
    }

    /**
     * On small screens, clicks on the following will toggle
     * the body class 'nav-open' - which is then used within the CSS
     * to show/hide the menu
     *
     * 1. Menu button
     * 2. Dark overlay
     */
    function toggleMobileMenu() {
        var state = $body.hasClass(constants.NAV_OPEN);
        if (state) {
            $body.removeClass(constants.NAV_OPEN);
            closeAllSubMenus();
        } else {
            $body.addClass(constants.NAV_OPEN);
        }
    }

    /**
     * When a top-level menu item is clicked/hovered,
     * use it's position in the dom to figure out it's
     * target - then toggle the active class on both
     * the trigger and the target
     * @param evt
     * @param {jQuery} $elem
     */
    function toggleSubMenu (evt, $elem) {

        evt.preventDefault();

        var currentState = $elem.hasClass(constants.ACTIVE);
        var $target = $elem.find($targets.selector);

        if (currentState) {
            $elem.removeClass(constants.ACTIVE);
            $target.removeClass(constants.ACTIVE);
            subMenuOpen = false;
        } else {
            $elem.addClass(constants.ACTIVE);
            $target.addClass(constants.ACTIVE);
            subMenuOpen = true;
        }

        /**
         * Close all OTHER submenus
         */
        if (state.aboveLap) {
            $triggers.not($elem).removeClass(constants.ACTIVE);
            $targets.not($target).removeClass(constants.ACTIVE);
        }
    }

    /**
     * Close every submenu regardless of current state
     */
    function closeAllSubMenus () {
        $triggers.removeClass(constants.ACTIVE).removeClass(constants.ACTIVE);
        $targets.removeClass(constants.ACTIVE);
    }

    /**
     * If a submenu item is open, but a user has click elsewhere on the page
     * close the submenus
     */
    $(document).on('click', function (evt) {
        if ($mainNav.length && !$mainNav[0].contains(evt.target)) {
            if (subMenuOpen) {
                closeAllSubMenus();
            }
        }
    });
}
