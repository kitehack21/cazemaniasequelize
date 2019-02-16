var express = require('express')
var router = express.Router()
const { destination } = require('../controllers')

router.get('/', destination.getDestinations)

router.get('/shipping', function(req,res){
    var options = {
        "method": "GET",
        "hostname": "api.sicepat.com",
        "port": null,
        "path": `/customer/tariff/?origin=TGR&destination=${req.query.destination}&weight=${req.query.weight}`,
        "headers": {
          "api-key": "54d16bfab958effecbfc849133dc706e"
        }
      };
      
      http.request(options, function (res1) {
        var chunks = [];
      
        res1.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res1.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
          console.log(typeof body)
          res.status(200).json(body)
        });
      }).end();
})

module.exports = router;