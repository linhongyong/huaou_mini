var httpClient = require('./httpClient.js')
let obj = new Object();

obj.pangzhanStatistics = (data) => httpClient.post('/pangzhan/statistics', data);


module.exports = obj;