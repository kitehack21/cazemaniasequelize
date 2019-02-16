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
    buildDestinations(req, res, destinations){
        sequelize.transaction(function(t){
            var promises = []
            
            destinations.map((item, index) => {
                promises.push( destination.create(item, { transaction: t }))
            })
            return Promise.all(promises)
        })
        .then((affectedRows) => {
            return res.status(200).json({
                message: "Build Destinations success"
            })
        })
        .catch((err) => {
            console.log("check deadlines error", err.message)
            return null
        })
    }
}