var express = require('express');
var bodyParser = require('body-parser');
const http = require('https');
var app = express();
const axios = require('axios');
const circular = require('circular-json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var apiKey = 'GET YOUR OWN KEY';

var options = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=&appid='+apiKey,
    method: 'GET'
  };

//   function GetDays(startDay, daysToAdd){
// 	var days = [];

// 	for(var i = 0; i < daysToAdd; i++){
// 		var currentDate = new Date();
// 		currentDate.setDate(startDay.getDate()+i);
// 		days.push(DayAsString(currentDate.getDay()));
// 	}
// 	return days;
// }

// function DayAsString(dayIndex) {
//     var weekdays = new Array(7);
//     weekdays[0] = "Sunday";
//     weekdays[1] = "Monday";
//     weekdays[2] = "Tuesday";
//     weekdays[3] = "Wednesday";
//     weekdays[4] = "Thursday";
//     weekdays[5] = "Friday";
//     weekdays[6] = "Saturday";

//     return weekdays[dayIndex];
// }

let city = 'toronto';
let lat = 0;
let lon = 0;
let dte;
// let current = 0;
// let current_feels = 0;
// let current_description = "";

exports.weather = function(query, callback){
    city = query.headers.city;
    options.path = '/data/2.5/weather?q='+city+'&appid='+apiKey;
    var forecast = [];

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=GET YOUR OWN KEY`)
        .then(res => {
            lat = res.data.coord.lat;
            lon = res.data.coord.lon;
            

            axios.get(`http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=GET YOUR OWN KEY`)
                .then(res =>{
                    var test2 = [];                   
                    test2.push(res.data.current.weather[0].id);
                    test2.push(Math.round(res.data.current.temp-273.15));
                    test2.push(Math.round(res.data.current.feels_like-273.15));
                    test2.push(res.data.current.weather[0].description);
                    forecast.push(test2);

                    for(var i = 0; i < 5; i++){
                        dte =  res.data.daily[i].dt;
                        let temp = new Date(dte*1000);
                        var test = [];
                        test.push(res.data.daily[i].weather[0].id);
                        test.push(Math.round((res.data.daily[i].temp.max)-273.15));
                        test.push(Math.round((res.data.daily[i].temp.min)-273.15));
                        test.push(res.data.daily[i].weather[0].description);
                        if(temp.getDay() == 0){
                            test.push("Sunday");
                        }
                        if(temp.getDay() == 1){
                            test.push("Monday");
                        }
                        if(temp.getDay() == 2){
                            test.push("Tuesday");
                        }
                        if(temp.getDay() == 3){
                            test.push("Wednesday");
                        }
                        if(temp.getDay() == 4){
                            test.push("Thursday");
                        }
                        if(temp.getDay() == 5){
                            test.push("Friday");
                        }
                        if(temp.getDay() == 6){
                            test.push("Saturday");
                        }
                        
                        forecast.push(test);

                    }
                    // console.log(res.data.daily[0].temp.max);
                    // console.log(res.data.daily[0].temp.min);
                    // console.log(res.data.daily[0].weather[0].description);

                    // console.log(forecast);
                    callback.send(forecast);
                    
                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        })
}


exports.gitusers = function(query, callback){

    user = query.headers.user;

    axios.get(`https://api.github.com/users/${user}/repos`)
        .then(res => {
            console.log(res);
            //callback.send("Meet");
            //console.log(JSON.parse(res));
            callback.send(circular.stringify(res.data));
            //callback.send(JSON.parse(JSON.stringify(res)));
        })
        .catch(err => {
            console.log(err);
        })
}

