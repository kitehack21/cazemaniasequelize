const { Sequelize, sequelize, phonemodel, brand } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get Links
    getPhoneModels(req, res){
        phonemodel.findAll()
         .then((result) => {
            return res.status(200).json({
                message: "Get phone models success",
                result
            })
         })
         .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    }, 
    editPhoneModel(req, res){
        phonemodel.findByPk(req.params.id)
        .then((phonemodelObj) => {
            if(!phonemodelObj){
                return res.status(404).json({
                    message: "No such phone model",
                    error: "Item not found"
                })
            }

            sequelize.transaction(function(t){
                const { name, soft, hard } = req.body
                return(
                    phonemodelObj.update({
                        name: name || phonemodelObj.name,
                        soft: soft || phonemodel.soft,
                        hard: hard || phonemodel.hard
                    })
                    .then((result) => {
                        return result
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: "Edit Phone Model Success",
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
    addPhoneModel(req, res){
        brand.findByPk(req.params.id)
        .then((brandObj) => {
            if(!brandObj){
                return res.status(404).json({
                    message: `Cannot find brand with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }

            const { name, soft, hard } = req.body
            sequelize.transaction(function(t){
                return (
                    phonemodel.create({
                        name: name,
                        brandId: req.params.id,
                        soft: soft,
                        hard: hard
                    }, { transaction: t })
                    .then((phoneModelObj) => {
                        return phoneModelObj
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Phone Model Creation Successful',
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