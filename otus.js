import http from 'k6/http';

export default function(){
http.get("https://test.k6.io/contacts.php");

console.log('hello!!!')

http.post('http://test.k6.io/flip_coin.php')
};