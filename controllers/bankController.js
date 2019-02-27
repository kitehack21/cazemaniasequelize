const { Sequelize, sequelize, bank } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get Links
    getBanks(req, res){
        bank.findAll()
         .then((result) => {
            return res.status(200).json({
                message: "Get banks success",
                result
            })
         })
         .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    editBank(req, res){
        console.log(req.body)
        bank.findByPk(req.params.id)
         .then((bankObj) => {
            if(!bankObj){
                return res.status(404).json({
                    message: `Cannot find bank with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }

            console.log('bankObj',bankObj)

            sequelize.transaction(function(t){
                const { name, accountNumber } = req.body
                return (
                    bankObj.update({
                        name: name,
                        accountNumber: accountNumber
                    }, { transaction: t })
                    .then((obj) => {
                        return obj
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Edit bank success',
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