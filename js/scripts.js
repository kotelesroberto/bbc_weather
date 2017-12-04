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
    },
    convertCtoF: function ( celsius ) { //convert from Celsius to Fahrenheit
        'use strict';
        var calculated = celsius * 9 / 5 + 32;
        return parseFloat( calculated.toFixed(2) );
    },
    convertFtoC: function ( fahrenheit ) { //convert from Fahrenheit to Celsius
        'use strict';
        var calculated = (fahrenheit - 32) * 5 / 9;
        return parseFloat( calculated.toFixed(2) );
    },
    convertKPMHtoMPH: function ( kmph ) { //convert from km/h to mph
        'use strict';
        var calculated = kmph / 1.609344;
        return parseFloat( calculated.toFixed(2) );
    },
    convertMPHtoKMPH: function ( mph ) { //convert from mph to km/h
        'use strict';
        var calculated = mph * 1.609344;
        return parseFloat( calculated.toFixed(2) );
    },
    timezoneToLocationName: function ( timezone ) {
        var locationName = timezone.split("/");
        return locationName[1].replace("_", " ");
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

/* Read JSON data source and put weather info into DOM */
var Services = {

    initialize: function () {
        var self = this;
        
        self.loadLocations();    
    },
    loadLocations: function () {
        'use strict';
        var self = this;

        var $contentPane = $("main");
        var $selectorContainer = $contentPane.find( '#forecast-selector' );

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

        var html = '<a href="#" class="city-selected dropdown-box"><p class="display-text"></p><span class="icon"></span></a>';  //' + locationArray[ 0 ].name + '

        html += '<ul class="city-list">';

        for( var key in locationArray ) {
            html += '<li class="" data-bgimage="' + locationArray[ key ].bgimage + '" data-latitude="' + locationArray[ key ].coordinates[0] + '" data-longitude="' + locationArray[ key ].coordinates[1] + '">' + locationArray[ key ].name + '</li>';
        }

        html += '</ul>';

        $selectorContainer.html(html).find("li:FIRST-CHILD").addClass("selected");

        //Append unit changer button
        $("#forecast-panel-daily").after('<div class="button-wrapper"><div class="change-temp-unit button" data-currenttempunit="F">Change units to &deg;<span class="temp-unit strong">C</span> and <span class="wind-unit strong">km&sol;h</span></div></div>');
        
        //init click events
        self.onClick( locationArray );

        //first city will be loaded
        self.loadList( locationArray[0].coordinates[0], locationArray[0].coordinates[1], locationArray[0].bgimage );
        
    },
    loadList: function ( latitude, longitude, bgimage ) {
        'use strict';
        var self = this;

        //var jsonPath = "./assets/json/sample.json";
        //var jsonPath = "https://api.darksky.net/forecast/6a949cbb55dfa9c681ae52ac95ef027d/37.8267,-122.4233";
        var jsonPath = "https://api.darksky.net/forecast/6a949cbb55dfa9c681ae52ac95ef027d/" + latitude + "," + longitude + "";
        
        
        var $contentPane = $("main");
        var $listCurrent = $contentPane.find( '#forecast-panel-current span.loadArea' );
        var $listDaily = $contentPane.find( '#forecast-panel-daily span.loadArea' );

        // Creating a virtual image object for loading the file into. When it's done it will be used as background image.
        // This solution helps avoid the blinking images at loading.
        var img = new Image();
        var imageUrl = "assets/images/cities/" + bgimage;
        img.src = imageUrl;
        img.onload = function(){
            // Image  has been loaded
            $(".location-bg").css("background-image", "url(" + imageUrl +")" ).removeClass("empty");
        };
                
        // Get belonging forecast data of the selected city
        $.ajax( jsonPath, {
            dataType: 'json'
        }).done(function ( data ) {

            if (data) {
                
                // Building the current forecast panel
                var html = '<div class="forecast-current">';
                    
                    html += '<h2 class="location">' + GeneralFunctions.timezoneToLocationName( data.timezone ) + '</h2>';

                        if (data.currently.temperature) {
                            html += '<div class="current-temperature temperature-value"><span class="temp-value" data-fahrenheit="' + data.currently.temperature + '">' + data.currently.temperature + '</span>&deg;<span class="temp-unit">F</span></div>';
                        }

                        if (data.currently.icon) {
                            html += '<div class="current-icon"><i class="' + iconArray[data.currently.icon] + '"></i></div>';
                        }

                        if (data.currently.summary) {
                            html += '<p class="current-summary">' + data.currently.summary + '</p>';
                        }

                        if (data.currently.windSpeed) {
                            html += '<p class="current-wind speed-value"><i class="pe-is-w-wind-cone"></i> <span class="wind-value" data-windspeed="' + data.currently.windSpeed + '">' + data.currently.windSpeed + '</span> <span class="wind-unit">mph</span> <i class="direction" data-direction="' + data.currently.windBearing + '" style="transform:rotate(-' + data.currently.windBearing + 'deg)">&rarr;</i></p>';
                        }

                    html += '</div>';

                    //load name of the city into city selector
                    $(".city-selected").find(".display-text").html( GeneralFunctions.timezoneToLocationName( data.timezone ) );

                    //load results into DOM wrapper
                    $listCurrent.html(html);
                    
                    
                // Building the daily forecast items
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
                       
                        // Create a new JavaScript Date object based on the timestamp
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                        var dayToDisplay = new Date(obj.time*1000).toString().split(' ')[0];

                        html += '<li>';
                            html += '<div class="daily-date">' + dayToDisplay +  '</div>';
                            html += '<div class="daily-icon"><i class="' + iconArray[obj.icon] + '"></i></div>';
                            html += '<div class="daily-maxTemperature temperature-value"><span class="temp-value" data-fahrenheit="' + obj.temperatureHigh + '">' + obj.temperatureHigh + '</span>&deg;<span class="temp-unit">F</span></div>';
                            html += '<div class="daily-minTemperature temperature-value"><span class="temp-value" data-fahrenheit="' + obj.temperatureLow + '">' + obj.temperatureLow + '</span>&deg;<span class="temp-unit">F</span></div>';
                        html += '</li>';

                    });
                    html += '</ul>';

                    $listDaily.html(html);              
                }

                //convert to the selected unit
                self.convertUnits( $('.change-temp-unit').attr('data-currenttempunit'), false );
            }

        });
    },
    convertUnits: function ( currentTempUnit, buttonAction ) {
            var $changeButton = $('.change-temp-unit');
            var $tempUnitToShow = $(".temperature-value .temp-unit");
            var $windspeedUnitToShow = $(".forecast-current .wind-unit");

            var $tempUnitToChangeFrom = $changeButton.find(".temp-unit");
            var $windspeedUnitToChangeFrom = $changeButton.find(".wind-unit");
            
            var convertFromFahrenheitToCelsius; 

            var newTempUnit = "";
            var currentSpeedUnit = "";
            var newSpeedUnit = "";

            if( buttonAction ) { //event fired by button
                if( currentTempUnit == "C" ) {
                    currentSpeedUnit = "km&sol;h";
                    newTempUnit = "F";                    
                    newSpeedUnit = "mph";
                    convertFromFahrenheitToCelsius = false;
                } else {
                    currentSpeedUnit = "mph";
                    newTempUnit = "C";                    
                    newSpeedUnit = "km&sol;h";
                    convertFromFahrenheitToCelsius = true; 
                }

                $changeButton.attr("data-currenttempunit", newTempUnit);
                $tempUnitToChangeFrom.html( currentTempUnit );
                $windspeedUnitToChangeFrom.html( currentSpeedUnit ); 

            } else { //event fired ajax loader
                if( currentTempUnit == "C" ) {
                    currentSpeedUnit = "mph";
                    newTempUnit = "C";                    
                    newSpeedUnit = "km&sol;h";
                    convertFromFahrenheitToCelsius = true;
                } else {
                    currentSpeedUnit = "km&sol;h";
                    newTempUnit = "F";                    
                    newSpeedUnit = "mph";
                    convertFromFahrenheitToCelsius = false;
                    convertFromFahrenheitToCelsius = false; 
                }
            }
            
            $tempUnitToShow.html( newTempUnit );
            $windspeedUnitToShow.html( newSpeedUnit );
                       
                
            $(".temperature-value").each( function () {
                var $this = $(this);
                var $valueToChange = $this.find(".temp-value");
                
                if( convertFromFahrenheitToCelsius ) {
                    $valueToChange.html( GeneralFunctions.convertFtoC( $valueToChange.data("fahrenheit") ) );
                } else {
                    $valueToChange.html( $valueToChange.data("fahrenheit") );
                }                
            });    

            $(".speed-value").each( function () {
                $this = $(this);
                var $valueToChange = $this.find(".wind-value");
                
                if( convertFromFahrenheitToCelsius ) {
                    $valueToChange.html( GeneralFunctions.convertMPHtoKMPH( $valueToChange.data("windspeed") ) );
                } else {
                    $valueToChange.html( $valueToChange.data("windspeed") );
                }                
            });
            
    },
    onClick: function ( locationArray ) { /*click events*/
        'use strict';
        var self = this;
        
        $('.dropdown-box').on('click', function() {
            var $this = $(this);
            
            $this.parent().toggleClass("dropdown-is-active");      
        });
        
        $('.city-list').find('li').on('click', function() {
            var $this = $(this);
            
            // Close the city list
            $(".dropdown-is-active").removeClass("dropdown-is-active");

            // Mark the selected item
            $this.siblings().removeClass("selected");
            $this.addClass("selected");

            // Load new forecast data with the proper coordinates
            self.loadList( $this.data('latitude'), $this.data('longitude'), $this.data('bgimage') );            
        });

        /* Changing the displayed units (Celsius or Fahrenheit, Mph or Km/h) */
        $('.change-temp-unit').on('click', function() {
            var $this = $(this);
            var $tempUnitToChangeFrom = $this.find(".temp-unit");

            self.convertUnits( $this.attr('data-currenttempunit'), true );
        });
        
        
    }

};

$(function () {

    /* Init functions */
    Header.initialize();
    Navigation.initialize();
    Footer.initialize();

    Services.initialize();

});