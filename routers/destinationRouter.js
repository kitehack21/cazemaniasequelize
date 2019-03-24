var express = require('express')
var router = express.Router()
const { destination } = require('../controllers')
var https = require("https");


router.get('/', destination.getDestinations)

router.get('/shipping', function(req,res){
    var agentOptions = {
        host: 'api.sicepat.com',
        port: '443',
        path: '/',
        rejectUnauthorized: false
    };

    var agent = new https.Agent(agentOptions)
    var options = {
        "method": "GET",
        "hostname": "api.sicepat.com",
        "port": null,
        "path": `/customer/tariff/?origin=TGR&destination=${req.query.destination}&weight=${req.query.weight}`,
        "agent": agent,
        "headers": {
          "api-key": "54d16bfab958effecbfc849133dc706e"
        }
      };

      var req = https.request(options, function (res1) {
        var chunks = [];
        res1.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res1.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          console.log(typeof body)
          res.send(body)
        });
      }).end();
})

// router.get('/build', function(req,res){
//     var options = {
//         "method": "GET",
//         "hostname": "api.sicepat.com",
//         "port": null,
//         "path": "/customer/destination",
//         "headers": {
//             "api-key": "54d16bfab958effecbfc849133dc706e",
//             "content-Type": "application/json"
//         }
//     };
//     http.request(options, function (res1) {
//         var chunks = [];
        
//         res1.on("data", function (chunk) {
//             chunks.push(chunk);
//         });
        
//         res1.on("end", function () {
//             var body = Buffer.concat(chunks);
//             console.log(body)
//             console.log(body.toString());
//             console.log(typeof body)
//             console.log(JSON.parse(body.toString()).sicepat)
//             destination.buildDestinations(req, res, JSON.parse(body.toString()).sicepat.results)
//         });
//     }).end();
// })
module.exports = router;