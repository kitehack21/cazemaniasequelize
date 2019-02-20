const { Sequelize, sequelize, user, cart } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get User's cart
    getUserCart(req, res){
        user.findByPk(req.user.id)
        .then((userObj) => {
            if(!userObj){
                return res.status(404).json({
                    message: "User not found!"
                })
            }
            cart.findAll({
                where: {
                    userId: userObj.id
                }
            })
            .then((result) => {
                return res.status(200).json({
                    message: "Get cart success",
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
    //Add to User's cart
    addToCart(req, res){
        user.findByPk(req.user.id)
        .then((userObj) => {
            if(!userObj){
                return res.status(404).json({
                    message: "User not found!"
                })
            }

            sequelize.transaction(function(t){
                const { catalogueId, phonemodelId, brand, model, caseType, amount } = req.body
                return(
                    cart.findOrCreate({
                        where: {
                            userId: userObj.id,
                            catalogueId: catalogueId,
                            phonemodelId: phonemodelId,
                            brand: brand,
                            model: model,
                            caseType: caseType
                        },
                        transaction: t 
                    })
                    .then((arr) => {
                        console.log(arr)
                        //checks if "created" is false
                        if(arr[1] === false){
                            console.log(arr[1], "add")
                            return(
                                arr[0].update({
                                    amount: arr[0].amount + amount
                                }, { transaction: t })
                                .then((incrementObj) => {
                                    console.log(incrementObj.amount)
                                    return incrementObj
                                })
                            )
                        }
                        else{
                            console.log(arr[1], "create")
                            return(
                                arr[0].update({
                                    amount: amount
                                },{ transaction: t })
                                .then((createdObj) => {
                                    return createdObj
                                })
                            )
                        }
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Add to cart success',
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
    //Clear User's cart
    clearUserCart(req, res){
        sequelize.transaction(function(t){
            return(
                cart.destroy({
                    where: {
                        userId: req.user.id
                    }
                }, { transaction: t })
                .then((result) => {
                    return result
                })
            )
        })
        .then((result) => {
            return res.status(200).json({
                message: 'Clear cart success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },   
}