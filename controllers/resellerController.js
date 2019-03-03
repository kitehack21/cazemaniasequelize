const { sequelize, user } = require('../models');

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

            console.log('userObj',userObj)

            sequelize.transaction(function(t){
                return (
                    reseller.create({
                        userId: req.params.id
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
    }
}