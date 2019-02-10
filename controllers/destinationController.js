const { Sequelize, sequelize, destination } = require('../models');
var fs = require('fs');
const Op = Sequelize.Op

module.exports = {   
    getDestinations(req, res){
        destination.findAll()
        .then((result) => {
            return res.status(200).json({
                message: 'GET Destinations Success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
}