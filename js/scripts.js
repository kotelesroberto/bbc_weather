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
    }
};

var Navigation = {
    initialize: function () {
        var self = this;
    }
};


var Footer = {
    initialize: function () {
        var self = this;
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