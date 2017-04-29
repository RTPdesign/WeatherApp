(function(){
    'use strict';
})();

// Self invoking function to protect variables from being modified.
(() => {
    let urlAPI;

    class Weather {
        constructor($div){
            this.createHTML($div)

        }
        createHTML($div){
            $div.append($('<input id="city" type="text" placeholder="City">'))
            $div.append($('<input id="state" type="text" placeholder="State">'))

            let $submit = $('<button type="button">Set Location</button><br />');
            let $wind = $('<button type="button" class="test">Wind</button>');
            let $weather = $('<button type="button">Weather</button>');

            $div.append($submit);
            $div.append($wind);
            $div.append($weather);

            $div.append($('<div id="wind"></div>'));
            $div.append($('<div id="weather"></div>'))

            $submit.on("click", (event) => {
                    this.displayError();
                    this.remove();
                    let location = this.setLocation();
                    urlAPI = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text='${location[0]}, ${location[1]}')&format=json`;
                    $("#wind")[0].classList.value = "";
                    $("#weather")[0].classList.value = "";
                });

            $wind.on("click", (event) => {
                let val = this.displayError();
                if (!val){
                if ($('#wind')[0].classList.value === "") {
                    $.ajax(urlAPI).done((result) =>{
                        // call functions to display results of wind
                        this.displayLocation($('#wind'), result.query.results.channel.location);
                        this.displayWeather($('#wind'), result.query.results.channel.wind);
                    });
                }
                this.visible($('#wind')[0]);
                }
            });    

            $weather.on("click", (event) => {
                this.displayError();
                if ($('#weather')[0].classList.value === "") {
                    $.ajax(urlAPI).done((result) =>{
                        // call functions to display results of weather
                        this.displayLocation($('#weather'), result.query.results.channel.location);
                        this.displayWeather($('#weather'), result.query.results.channel.item.forecast[0]);
                    });
                }
                this.visible($('#weather')[0]);
            });
        }

        displayError(){
            let city = $('#city')[0].value;
            let state = $('#state')[0].value;
            if (city === "" || state === ""){
                console.error(new Error("Neet to set location."));
                return true;
            }
            return false;
        }

        displayLocation($div, value){
            // display city and region
            $div.append($(`<h1>${value.city}, ${value.region}</h1>`));
        }

        displayWeather($div, value){
            for (let property in value) {
                if (value.hasOwnProperty(property)) {
                    $div.append($(`<h1>${property}: ${value[property]}</h1>`));
                }
            }
        }

        visible($div) {
            if ($div.classList.value === "visible") {
                $div.classList.value = "notVisible";
            }
            else {
                $div.classList.value = "visible";
            }

        }

        setLocation(){
            let city = $('#city')[0].value;
            let state = $('#state')[0].value;
            return [city, state];
        }
        remove(){
            $('h1').remove();
        }
    }
    new Weather($("#displayApp"));
})();