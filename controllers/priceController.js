const { Sequelize, sequelize, price } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get Price
    getPrice(req, res){
        price.findAll()
        .then((result) => {
            return res.status(200).json({
                message: "Get price success",
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    editPrice(req, res){
        price.findByPk(req.params.id)
         .then((priceObj) => {
            if(!priceObj){
                return res.status(404).json({
                    message: `Cannot find price with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }

            sequelize.transaction(function(t){
                const { price, resellerPrice } = req.body
                return (
                    priceObj.update({
                        price: price,
                        resellerPrice: resellerPrice
                    }, { transaction: t })
                    .then((obj) => {
                        return obj
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Edit price success',
                    result
                })
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            })

         })
         .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },   
}