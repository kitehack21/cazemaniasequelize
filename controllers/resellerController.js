const { sequelize, user, reseller } = require('../models');

module.exports = {
    //User Registration
    registerReseller(req, res){
        user.findByPk(req.user.id)
        .then((userObj) => {
            if(!userObj){
                return res.status(404).json({
                    message: "User not found!"
                })
            }

            reseller.findOne({
                where: {
                    userId: req.user.id
                }
            })
            .then((resellerObj) => {
                if(resellerObj){
                    return res.status(404).json({
                        message: "User already request!"
                    })
                }

                sequelize.transaction(function(t){
                    return (
                        reseller.create({
                            userId: userObj.id
                        }, { transaction: t })
                        .then((result) => {
                            return result
                        })
                        .catch((err) => {
                            console.log(err.message)
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        })
                    )
                })
                .then((result) => {
                    return res.status(200).json({
                        message: 'Request Reseller Successul',
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
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    getAll(req, res){
        reseller.findAll({
            where: {
                isResolved: 0
            },
            include: [
                {
                    model: user,
                    required: false
                }
            ]
        })
         .then((result) => {
            return res.status(200).json({
                message: "Get resellers success",
                result
            })
         })
         .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    adminAccept(req, res){
        reseller.findByPk(req.params.id,{
            include: [
                {
                    model: user
                }
            ]
        })
        .then((resellerObj) => {
            if(!resellerObj){
                res.status(404).json({
                    message: "reseller not found!"
                })
            }

            sequelize.transaction(function(t){
                return(
                    resellerObj.update({
                        isResolved: true
                    }, { transaction: t })
                    .then((result) => {
                        return(
                            resellerObj.user.update({
                                category: 'reseller'
                            }, {transaction: t })
                            .then((result) => {
                                return result
                            })
                        )
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Update reseller success',
                    result
                })
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            })
        })
    },
    adminReject(req, res){
        reseller.findByPk(req.params.id)
        .then((resellerObj) => {
            if(!resellerObj){
                res.status(404).json({
                    message: "reseller not found!"
                })
            }

            sequelize.transaction(function(t){
                return(
                    resellerObj.update({
                        isResolved: true
                    }, { transaction: t })
                    .then((result) => {
                        return result
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Reject reseller success',
                    result
                })
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            })
        })
    }
}