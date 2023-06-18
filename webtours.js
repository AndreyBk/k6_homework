import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { findBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { Trend } from 'k6/metrics';

//--vus 1 --http-debug="full" --out influxdb=http://192.168.0.116:8086/k6database

export const options = {
    scenarios: {
        sc3: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                    { duration: '6s', target: 2 },
                    { duration: '10m', target: 2 },
                    { duration: '6s', target: 4 },
                    { duration: '10m', target: 4 },
                    { duration: '6s', target: 6 },
                    { duration: '10m', target: 6 },
                    { duration: '6s', target: 8 },
                    { duration: '10m', target: 8 },
                    { duration: '6s', target: 10 },
                    { duration: '10m', target: 10 },
                    { duration: '6s', target: 12 },
                    { duration: '10m', target: 12 },
                    { duration: '6s', target: 14 },
                    { duration: '10m', target: 14 },
                    { duration: '6s', target: 16 },
                    { duration: '10m', target: 16 },
                    { duration: '6s', target: 18 },
                    { duration: '10m', target: 18 },
                    { duration: '6s', target: 20 },
                    { duration: '10m', target: 20 },
                    { duration: '6s', target: 22 },
                    { duration: '10m', target: 22 },
                    { duration: '6s', target: 24 },
                    { duration: '10m', target: 24 },
                    { duration: '6s', target: 26 },
                    { duration: '10m', target: 26 },
                  ],
            gracefulRampDown: '0s',
        },
    },
};
const loginData = JSON.parse(open("./creds.json"));  // download the data file here: https://test.k6.io/static/examples/users.json

const BASE_URL = 'http://webtours.load-test.ru:1080';

let groups_time = new Trend("groups_time", true);
let USERSESSION="";

const    requestHeaders_0 = {
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'ru-RU,ru;q=0.9',
        'Proxy-Connection': 'keep-alive',
        'Upgrade-Insecure-Requests' : '1'
    };
const    requestHeaders_8 = {
        'Accept-Encoding': 'gzip, deflate',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'ru-RU,ru;q=0.9',
        'Cache-Control': 'max-age=0',
        'Origin': 'http://webtours.load-test.ru:1080',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    };

export default function () {
    var cycleTime = 12000;
    var startTime = Date.now();
    get_root_page();
    loginininng();
    let AEROPORTS=click_flights_button();
    let depar_arrive=aero_random_selected(AEROPORTS);
    var random_boolean = Math.random() < 0.5;
//    random_boolean=false;
    if (random_boolean) {
        let FLIGHTS=one_way_find_flight_and_continue(depar_arrive);
        let FLIGHT = flight_random_selected(FLIGHTS);
        one_way_find_flight_raise_and_continue(FLIGHT);
        one_way_payment_details_and_continue(FLIGHT);
    } else{
        let FLIGHTS_AND_RETURN_FLIGHTS = round_trip_find_flight_and_continue(depar_arrive);
        let FLIGHT_AND_RETURN_FLIGHT =  flights_random_selected(FLIGHTS_AND_RETURN_FLIGHTS);
        round_trip_find_flight_raise_and_continue(FLIGHT_AND_RETURN_FLIGHT);
        round_trip_payment_details_and_continue(FLIGHT_AND_RETURN_FLIGHT);
    }
    let TIKS = invoice_itineary_button_group();
    let request_body=cancele_checked_body_build(TIKS);
    cancele_checked_button_group(request_body);

    sign_off();
    group('pacing_group', ()=>{
        sleep(pacing(cycleTime, startTime));
    });
}

export function pacing(cycleTime, startTime) {
    let waitTime = 0;
    var endTime = Date.now();
    let duration = endTime - startTime;
    waitTime = cycleTime - duration;
    waitTime = waitTime / 1000;
//    console.log('********'+waitTime);
    if (waitTime<2){
        waitTime=0;
    }
    waitTime=waitTime+Math.random();
    //todo проверить на отрицательное значение
    return waitTime;
}

export function url_encoded(uri, params){
        const url = new URL(BASE_URL+uri);
        params.forEach((_p)=>{
            url.searchParams.append(_p[0], _p[1]);
        })
        return url.toString();
};

export function get_root_page(){
//todo добавить проверку на 200
    group('root_page_group', ()=>{
//        startTime = Date.now();//        let startTime = Date.now();
        let resGet = http.get(BASE_URL+'/webtours/',{headers:requestHeaders_0});
        resGet = http.get(BASE_URL+'/webtours/header.html',{headers:requestHeaders_0});
        resGet = http.get(BASE_URL+'/cgi-bin/welcome.pl',{headers:requestHeaders_0, tags:{'signOff': true }});
        resGet = http.get(BASE_URL+'/WebTours/home.html',{headers:requestHeaders_0});
        let _uri=url_encoded('/cgi-bin/nav.pl',[['in','home']])
        resGet = http.get(_uri,{headers:requestHeaders_0});
        USERSESSION = findBetween(resGet.body, 'name="userSession" value="','"/>')
    });
}

export function loginininng(){
    group('loginininng_group', ()=>{
        let position = Math.floor(Math.random()*loginData.users.length);
        let credentials = loginData.users[position];
        let resPost = http.post(BASE_URL+'/cgi-bin/login.pl',
            { // body
             userSession: USERSESSION,
             username: credentials.username,
             password: credentials.password,
             'login.x': '26',
             'login.y': '11',
             JSFormSubmit: 'off'
            },
            {headers:requestHeaders_8}// headers and params
            );
        // проверить содержимо еответа и если некоррекный пароль, сразу прервать пользователя
        if (check(resPost, {'User password was incorrect': (resPost) => resPost.body.includes('User password was incorrect.  Prompt the user to fix password or sign-up...')}))
            {
                fail('User password was incorrect '+ credentials.username+' '+credentials.password);
            }
        let res = http.batch([
            ["GET", BASE_URL+'/cgi-bin/nav.pl', {}, { tags: { 'page': "menu", 'in': 'home' }, headers:requestHeaders_0 }],
            ["GET", BASE_URL+'/cgi-bin/login.pl', {}, { tags: { 'intro': "true" }, headers:requestHeaders_0 }]]);
    });
}

export function click_flights_button(){
    let _aero = group('click_flights_button_group', ()=>{
        let resGet = http.get(BASE_URL+'/cgi-bin/welcome.pl',
            {
                tags:{'page': 'search' },
                headers:requestHeaders_0}// headers and params
            );
        // проверить содержимо еответа и если некоррекный пароль, сразу прервать пользователя
        // добавиь batch
        let res = http.batch([
            ["GET", BASE_URL+'/cgi-bin/nav.pl', {}, { tags: { 'page': "menu", 'in': 'flights' }, headers:requestHeaders_0 }],
            ["GET", BASE_URL+'/cgi-bin/reservations.pl', {}, { tags: { 'page': "welcome" }, headers:requestHeaders_0 }]]);
        const reg=/option?.+value=".+">(.+)</g;
        return [...res[1].body.matchAll(reg)]
    });
    return _aero;
}

export function aero_random_selected(aero){
    let departure_aero='';
    let arrived_aero='';
    do {
        departure_aero = aero[Math.floor(Math.random()*aero.length)][1];
        arrived_aero = aero[Math.floor(Math.random()*aero.length)][1];
    } while (departure_aero == arrived_aero);
    return [departure_aero, arrived_aero];
}

export function one_way_find_flight_and_continue(depar_arrive){
    let FLIGHTS=group('find_flight_and_continue_group',()=>{
        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'advanceDiscount': '0',
             'depart': depar_arrive[0],
             'departDate': '06/15/2023',
             'arrive': depar_arrive[1],
             'returnDate': '06/16/2023',
             'numPassengers': '1',
             'seatPref': 'None',
             'seatType': 'Coach',
             'findFlights.x': '33',
             'findFlights.y': '5',
             '.cgifields': 'roundtrip',
             '.cgifields': 'seatType',
             '.cgifields': 'seatPref'
            },
            {headers:requestHeaders_8}// headers and params
            );
        let FLIGHTS = findBetween(resPost.body, '<input type="radio" name="outboundFlight" value="','"', true)
        return FLIGHTS;
    });
    return FLIGHTS;
}

export function round_trip_find_flight_and_continue(depar_arrive){
    let FLIGHTS_AND_RETURN_FLIGHTS=group('find_flight_and_continue_group',()=>{
        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'advanceDiscount': '0',
             'depart': depar_arrive[0],
             'departDate': '06/15/2023',
             'arrive': depar_arrive[1],
             'returnDate': '06/16/2023',
             'numPassengers': '1',
             'seatPref': 'None',
             'seatType': 'Coach',
             'findFlights.x': '33',
             'findFlights.y': '5',
             '.cgifields': 'roundtrip',
             '.cgifields': 'seatType',
             '.cgifields': 'seatPref',
             'roundtrip': 'on'
            },
            {headers:requestHeaders_8}// headers and params
            );
        let FLIGHTS = findBetween(resPost.body, '<input type="radio" name="outboundFlight" value="','"', true);
        let RETURN_FLIGHTS = findBetween(resPost.body, '<input type="radio" name="returnFlight" value="','"', true);
        return [FLIGHTS, RETURN_FLIGHTS];
    });
    return FLIGHTS_AND_RETURN_FLIGHTS;
}

export function flight_random_selected(flights){
        return flights[Math.floor(Math.random()*flights.length)];
    }
export function flights_random_selected(flights_and_return_flights){
        let FLIGHT =flights_and_return_flights[0][Math.floor(Math.random()*flights_and_return_flights[0].length)];
        let RETURN_FLIGHT =flights_and_return_flights[1][Math.floor(Math.random()*flights_and_return_flights[1].length)];
        return [FLIGHT,RETURN_FLIGHT];
    }

export function one_way_find_flight_raise_and_continue(flight){
    group('find_flight_raise_and_continue_group', ()=>{

        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'outboundFlight': flight,
             'numPassengers': '1',
             'advanceDiscount': '0',
             'seatType': 'Coach',
             'seatPref': 'None',
             'reserveFlights.x': '45',
             'reserveFlights.y': '7',
            },
            {headers:requestHeaders_8}// headers and params
            );
    });
}

export function one_way_payment_details_and_continue(flight){
    group('payment_details_and_continue_group', ()=>{

        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'firstName': 'andrey',
             'lastName': 'cher',
             'address1': 'Berlin strasse',
             'address2': 'Gamburg',
             'pass1': 'andrey cher',
             'creditCard': '',
             'expDate': '',
             'oldCCOption': '',
             'numPassengers': '1',
             'seatType': 'Coach',
             'seatPref': 'None',
             'outboundFlight': flight,
             'advanceDiscount': '0',
             'returnFlight': '',
             'JSFormSubmit': 'off',
             'buyFlights.x': '62',
             'buyFlights.y': '5',
             '.cgifields': 'saveCC'
            },
            {headers:requestHeaders_8}// headers and params
            );
    });
}

export function round_trip_find_flight_raise_and_continue(flights){
    group('find_flight_raise_and_continue_group', ()=>{

        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'outboundFlight': flights[0],
             'returnFlight': flights[1],
             'numPassengers': '1',
             'advanceDiscount': '0',
             'seatType': 'Coach',
             'seatPref': 'None',
             'reserveFlights.x': '45',
             'reserveFlights.y': '7',
            },
            {headers:requestHeaders_8}// headers and params
            );
    });
}

export function round_trip_payment_details_and_continue(flights){
    group('payment_details_and_continue_group', ()=>{

        let resPost = http.post(BASE_URL+'/cgi-bin/reservations.pl',
            { // body
             'firstName': 'andrey',
             'lastName': 'cher',
             'address1': 'Berlin strasse',
             'address2': 'Gamburg',
             'pass1': 'andrey cher',
             'creditCard': '',
             'expDate': '',
             'oldCCOption': '',
             'numPassengers': '1',
             'seatType': 'Coach',
             'seatPref': 'None',
             'outboundFlight': flights[0],
             'returnFlight': flights[1],
             'advanceDiscount': '0',
             'JSFormSubmit': 'off',
             'buyFlights.x': '62',
             'buyFlights.y': '5',
             '.cgifields': 'saveCC'
            },
            {headers:requestHeaders_8}// headers and params
            );
    });
}

export function invoice_itineary_button_group(){
    let TIKS = group('invoice_itineary_button_group', ()=>{
        let resGet = http.get(BASE_URL+'/cgi-bin/welcome.pl',{ tags: { 'page': "itinerary" }, headers:requestHeaders_0});
        let res = http.batch([
            ["GET", BASE_URL+'/cgi-bin/nav.pl', {}, { tags: { 'page': "menu", 'in': 'itinerary' }, headers:requestHeaders_0 }],
            ["GET", BASE_URL+'/cgi-bin/itinerary.pl', {}, {headers:requestHeaders_0 }]]);
        let TICKETS = findBetween(res[1].body, '<input type="hidden" name="flightID" value="','"', true)
        let IDS_TICKETS = findBetween(res[1].body, '<input type="hidden" name=".cgifields" value="','"', true)
        return [TICKETS, IDS_TICKETS]
    });
    return TIKS;
}

export function cancele_checked_body_build(tiks){
        let _body ='1=on&removeFlights.x=53&removeFlights.y=3';
        let _i = 0;
        if (tiks[1]!=null){
            while(_i<tiks[1].length){
                _body=_body+'&flightID='+tiks[0][_i]+'&.cgifields='+tiks[1][_i];
                _i++;
            }
        }
    return _body;
}

export function cancele_checked_button_group(request_body){
    group('cancele_checked_button_group', ()=>{
        http.post(BASE_URL+'/cgi-bin/itinerary.pl', request_body, {headers:requestHeaders_8});
    });
}

export function sign_off(){
    group('sign_off_group', ()=>{
        let _uri=url_encoded('/cgi-bin/welcome.pl',[['signOff','1']]);
        let resGet = http.get(_uri,{headers:requestHeaders_0});

        _uri=url_encoded('/cgi-bin/nav.pl',[['in','home']]);
        resGet = http.get(_uri,{headers:requestHeaders_0});
    });
}
