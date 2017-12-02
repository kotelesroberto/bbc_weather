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


/* Read JSON data source and put weather info into DOM */
var Services = {

    initialize: function () {
        var self = this;
        var jsonPath = "./assets/json/sample.json";
        //var jsonPath = "https://api.darksky.net/forecast/6a949cbb55dfa9c681ae52ac95ef027d/37.8267,-122.4233";
        //var jsonPath = "https://api.darksky.net/forecast/6a949cbb55dfa9c681ae52ac95ef027d/" + locationArray[locationIndex].coordinates[0] + "," + locationArray[locationIndex].coordinates[1] + "";
       
        var iconArray = 
            {
                'clear-day' : 'pe-is-w-sun-1',
                'clear-night' : 'pe-is-w-moon-1',
                'rain' : 'pe-is-w-rain-1',
                'snow' : 'pe-is-w-snow',
                'sleet' : 'pe-is-w-rain-and-snow',
                'wind' : 'pe-is-w-wind-2',
                'fog' : 'pe-is-w-fog-1',
                'cloudy' : 'pe-is-w-mostly-cloudy-2',
                'partly-cloudy-day' : 'pe-is-w-partly-cloudy-1',
                'partly-cloudy-night' : 'pe-is-w-partly-cloudy-3',
                'hail' : 'pe-is-w-hail-1',
                'thunderstorm' : 'pe-is-w-thunderstorm',
                'tornado' : 'pe-is-w-tornado-1'
            };

            self.loadLocations();
            self.loadList( jsonPath, iconArray );

    },
    loadLocations: function () {
        'use strict';
        var self = this;

        var $contentPane = $("main");
        var $selectorContainer = $contentPane.find( '#forecast-selector' );

        var locationIndex = 0;
        var locationArray = 
            [
                {
                    'name' : 'London',
                    'coordinates' : ['51.507194', '-0.137311'],
                    'bgimage' : 'london.jpg'
                },
                {
                    'name' : 'Paris',
                    'coordinates' : ['48.856878', '2.348987'],
                    'bgimage' : 'paris.jpg'
                },
                {
                    'name' : 'New York',
                    'coordinates' : ['40.686658', '-73.970547'],
                    'bgimage' : 'newyork.jpg'
                },
                {
                    'name' : 'Singapore',
                    'coordinates' : ['1.346260', '103.847672'],
                    'bgimage' : 'singapore.jpg'
                },
                {
                    'name' : 'Sydney',
                    'coordinates' : ['-33.830817', '151.212088'],
                    'bgimage' : 'sydney.jpg'
                }
            ];

        var html = '<div class="city-list">';

        for( var key in locationArray ) {
            html += '<li class="" data-latitude="' + locationArray[ key ].coordinates[0] + '" data-longitude="' + locationArray[ key ].coordinates[1] + '">' + locationArray[ key ].name + '</li>';
        }

        html += '</div>';

        $selectorContainer.html(html);
        
    },
    loadList: function ( url, iconArray) {
        'use strict';
        var self = this;
        
        var $contentPane = $("main");
        var $listCurrent = $contentPane.find( '#forecast-panel-current span' );
        var $listDaily = $contentPane.find( '#forecast-panel-daily span' );
                
        $.ajax( url, {
            dataType: 'json'
        }).done(function ( data ) {

            if (data) {
                
                console.log(data);
                
                var html = '<div class="forecast-current">';
                    
                    html += '<h2 class="location">' + data.timezone + '</h2>';

                        if (data.currently.temperature) {
                            html += '<div class="current-temperature">' + data.currently.temperature + '&deg;</div>';
                        }

                        if (data.currently.icon) {
                            html += '<div class="current-icon"><i class="' + iconArray[data.currently.icon] + '"></i></div>';
                        }

                        if (data.currently.summary) {
                            html += '<div class="current-summary">' + data.currently.summary + '</div>';
                        }

                        if (data.currently.windSpeed) {
                            html += '<div class="current-wind"><i class="pe-is-w-wind-cone"></i> ' + data.currently.windSpeed + ' mph <i class="direction" data-direction="' + data.currently.windBearing + '" style="transform:rotate(-' + data.currently.windBearing + 'deg)">&rarr;</i></div>';
                        }

                    html += '</div>';

                    $listCurrent.html(html);

                    
                //forecast in terms of days
                if (data.daily) {

                    html = '';

                    if( data.daily.summary ) {
                        html += '<p>' + data.daily.summary + '</p>';
                    }
                    
                    /*
                    if (data.daily.icon) {
                        html += '<div class="daily-icon"><i class="' + iconArray[data.daily.icon] + '"></i></div>';
                    }
                    */

                    html += '<ul class="forecast-daily">';
                    $.each(data.daily.data, function (key, obj) {
                        console.log(obj);
                        
                        // Create a new JavaScript Date object based on the timestamp
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                        var dayToDisplay = new Date(obj.time*1000).toString().split(' ')[0];

                        html += '<li>';
                            html += '<div class="daily-date">' + dayToDisplay +  '</div>';
                            html += '<div class="daily-icon"><i class="' + iconArray[obj.icon] + '"></i></div>';
                            html += '<div class="daily-maxTemperature">' + obj.temperatureHigh +  '&deg;</div>';
                            html += '<div class="daily-minTemperature">' + obj.temperatureLow +  '&deg;</div>';
                        html += '</li>';

                    });
                    html += '</ul>';

                    $listDaily.html(html);              
                }
                
                

            }
        });
    }

};

$(function () {

    Header.initialize();
    Navigation.initialize();
    Footer.initialize();

    Services.initialize();

});