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
                return res.status(404).json({
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
                const { catalogueId, brand, model, caseType, amount } = req.body
                return(
                    cart.findOrCreate({
                        userId: userObj.id,
                        catalogueId: catalogueId,
                        brand: brand,
                        model: model,
                        caseType: caseType
                    }, { transaction: t })
                    .then((cartArr) => {
                        console.log(cartArr)
                        //checks if "created" is false
                        if(cartArr[1] === false){
                            return(
                                cartArr[0].update({
                                    amount: cartArr[0].amount + amount
                                })
                                .then((result) => {
                                    return result
                                })
                                .catch((err) => {
                                    console.log(err.message)
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                                })
                            )
                        }
                        else{
                            return(
                                cartArr[0].update({
                                    amount: amount
                                })
                                .then((result) => {
                                    return result
                                })
                                .catch((err) => {
                                    console.log(err.message)
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                                })
                            )
                        }
                    })
                    .catch((err) => {
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
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
        cart.findAll({
            where: {
                userId: req.params.id
            },
        })
        .then((userCartArr) => {
            sequelize.transaction(function(t){
                return(
                    userCartArr.destroy()
                    .then((res) => {
                        return res
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
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },   
}