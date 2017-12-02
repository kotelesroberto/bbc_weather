/******************************************
*   Robert Koteles
*   Web developer
*   2017
*	BBCWeather application task
******************************************/

/*********************
*  GENERAL FUNCTIONS
*********************/

var GeneralFunctions = {
    prevent_default: function () {
        'use strict';
        if (window.event) {
            window.event.returnValue = false;
        } else if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
};

/*********************
*  SPECIFIC FUNCTIONS
*********************/

var Header = {
    initialize: function () {
        var self = this;
        self.onScroll();
    },
    onScroll: function () { /*depends on scroll direction we use different class names*/
        'use strict';
        var self = this;
        var scrollDirection;
        var scrollPositionNew;
        var scrollPositionOld = $(window).scrollTop();
        $(window).on('scroll', function () {
            scrollPositionNew = $(window).scrollTop();
            if (scrollPositionOld < 100) {
                scrollDirection = '';
            } else {
                if (scrollPositionOld > scrollPositionNew) {
                    scrollDirection = 'scrolling-up';
                }
                if (scrollPositionOld < scrollPositionNew) {
                    scrollDirection = 'scrolling-down';
                }
            }
            scrollPositionOld = scrollPositionNew;
            self.handleState(scrollDirection);
        });
    },
    handleState: function (scrollDirection) {
        'use strict';
        $('body').removeClass('scrolling-up scrolling-down').addClass(scrollDirection);
    }
};

var Navigation = {
    initialize: function () {
        var self = this;
        $('#primary-menu li').mouseenter(function () {
            self.onOpen();
        });

        $('#primary-menu li').mouseleave(function () {
            self.onClose();
        });

        self.onClick();
    },
    onClick: function () { /*click events*/
        'use strict';
        var self = this;
        
        $('.header-logo').on('click', function() {
            window.location.href = "index.html";
        });

        $("#mobilemenu-trigger").on("click", function() {
            GeneralFunctions.prevent_default();
            $(this).parents("header").toggleClass("mobilemenu-open");
        });
        
        
    },
    onOpen: function () { /*if we have submenu*/
        'use strict';
        $('body').addClass('navigation-visible');
    },
    onClose: function () {
        'use strict';
        $('body').removeClass('navigation-visible');
    }
};


var Footer = {
    initialize: function () {
        var self = this;

        self.onClick();
    },
    onClick: function () { /*click events*/
        'use strict';
        var self = this;
    
        $('.footer-logo').on('click', function() {
            window.location.href = "index.html";
        });
        
    }
};


var Services = {

    initialize: function () {
        var self = this;
    }

};


$(function () {

    Header.initialize();
    Navigation.initialize();
    Footer.initialize();

    Services.initialize();

});