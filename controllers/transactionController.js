const { Sequelize, sequelize, user, bank, cart, transaction, catalogue, transactionDetail, price } = require('../models');
const { validate } = require("../helpers").validator;
var voucher_codes = require('voucher-code-generator');
var moment = require('moment')
var fs = require('fs');
var { uploader, } = require('../helpers').uploader
var { emailer } = require('../helpers').emailer;
const Op = Sequelize.Op

module.exports = {   
    uploadProof(req, res){
        transaction.findByPk(req.params.id)
        .then((transactionObj) => {
            if(!transactionObj){
                return res.status(404).json({ message: 'Transaction record does not exist', error: `Transaction with ID ${req.params.id} does not exist` });
            }
            if(req.user.id !== transactionObj.userId){
                return res.status(404).json({ message: 'Unauthorized ID', error: `User ID does not match transaction` });
            }

            const path = '/bukti';
            const upload = uploader(path, 'TRF').fields([{ name: 'proof'}]);

            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload file failed !', error: err.message });
                }

                const { proof } = req.files;
                console.log(proof)
                const proofPath = proof ? path + '/' + proof[0].filename : null;

                try {
                    if(proofPath && transactionObj.proof) {
                        fs.unlinkSync('./public' + transactionObj.proof);
                    }

                    sequelize.transaction(function(t){
                        return (
                            transactionObj.update({
                                proof: proof ? proofPath : transactionObj.proof,
                                status: "pendingConfirmation"
                            }, { transaction: t })
                            .then((result) => {
                                return result
                            })
                        )
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: 'Upload Successful',
                            result
                        })
                    })
                    .catch((err) => {
                        console.log(err.message)
                        if(proofPath){
                            fs.unlinkSync('./public' + proofPath);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    })
                }
                catch(error){
                    console.log(error.message)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: error.message });
                }
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    confirmProof(req, res){
        transaction.findByPk(req.params.id,{
            include: [
                {
                    model: user,
                    attributes: [
                        "email",
                        "firstname",
                        "lastname"
                    ]
                },
                {
                    model: bank,
                    attributes: [
                        "name",
                        "accountNumber"
                    ]
                }
            ]
        })
        .then((transactionObj) => {
            if(!transactionObj){
                return res.status(404).json({ message: 'Transaction record does not exist', error: `Transaction with ID ${req.params.id} does not exist` });
            }

            sequelize.transaction(function(t){
                return (
                    transactionObj.update({
                        status: "pendingDelivery",
                    }, { transaction: t })
                    .then((result) => {
                        var subject = "Pesanan Cazemania Anda"
                        var numlength = transactionObj.id.toString().split("")
                        var zeroes = ""
                        for(var i = numlength.length; i < 5; i++){
                            zeroes += 0
                        }

                        var replacements = {
                            Name: `${transactionObj.user.firstname} ${transactionObj.user.lastname}`,
                            TotalPrice: `Rp. ${transactionObj.totalPrice.toLocaleString()}`,
                            Reciever: `${transactionObj.firstname} ${transactionObj.lastname}`,
                            Alamat: transactionObj.address,
                            Kota: transactionObj.kota,
                            Kodepos: transactionObj.kodepos,
                            BankName: transactionObj.bank.name,
                            BankNumber: transactionObj.bank.accountNumber,
                            OrderId: `CMW#${zeroes}${transactionObj.id}`
                        }

                        var attachments = [
                            {
                                filename: 'logo.png',
                                path: './public/others/logo.png',
                                cid: 'cazemanialogo'
                            }
                        ]
                        try{
                            return emailer(transactionObj.user.email, subject, "./email/order.html", replacements, attachments, t)
                        }
                        catch(err){
                            console.log(err, "error")
                            t.rollback()
                        }
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Confirmation of Proof Success',
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
    adminAddResi(req, res){
        transaction.findByPk(req.params.id,{
            include: [
                {
                    model: transactionDetails,
                    include: [
                        {
                            model: catalogue
                        }
                    ]
                }
            ]
        })
        .then((transactionObj) => {
            if(!transactionObj){
                res.status(404).json({
                    message: "Transaction not found!"
                })
            }

            const { resi } = req.body
            sequelize.transaction(function(t){
                return(
                    transactionObj.update({
                        resi: resi,
                        status: "complete"
                    }, { transaction: t })
                    .then((result) => {
                        const { transactionDetails } = transactionObj
                        var promises = []
                
                        transactionDetails.map((item, index) => {
                            promises.push( item.catalogue.update({sales: parseInt(item.catalogue.sales) + parseInt(item.amount)}, { transaction: t }))
                        })
                        return Promise.all(promises)
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'Add Resi success',
                    result
                })
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            })
        })
    },
    createTransaction(req, res){
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
                },
                include: [
                    {
                        model: catalogue
                    }
                ]
            })
            .then((cartArr) => {
                if(!cartArr){
                    return res.status(404).json({
                        message: "Cart is empty!"
                    })
                }
                price.findAll()
                .then((priceArr) => {

                    var priceSoft = 0
                    var priceHard = 0
                    var priceSoftCustom = 0
                    var priceHardCustom = 0
                    var pricePremium = 0

                    priceArr.forEach((item, index) => {
                        if (userObj.category === 'customer') {
                            if(item.case_type === "soft"){
                                priceSoft = item.price
                            }
                            if(item.case_type === "hard"){
                                priceHard = item.price
                            }
                            if(item.case_type === "customsoft"){
                                priceSoftCustom = item.price
                            }
                            if(item.case_type === "customhard"){
                                priceHardCustom = item.price
                            }
                            if(item.case_type === "premium"){
                                pricePremium = item.price
                            }
                        } else if (userObj.category === 'reseller') {
                            if(item.case_type === "soft"){
                                priceSoft = item.resellerPrice
                            }
                            if(item.case_type === "hard"){
                                priceHard = item.resellerPrice
                            }
                            if(item.case_type === "customsoft"){
                                priceSoftCustom = item.resellerPrice
                            }
                            if(item.case_type === "customhard"){
                                priceHardCustom = item.resellerPrice
                            }
                            if(item.case_type === "premium"){
                                pricePremium = item.resellerPrice
                            }
                        }
                    })

                    if(!(priceSoft && priceHard && priceSoftCustom && priceHardCustom && pricePremium)){
                        return res.status(404).json({
                            message: "Missing price(s)!"
                        })
                    }

                    var generateOrderId = voucher_codes.generate({
                        length: 4,
                        count: 1,
                        prefix: `CMW${moment().format('MMYY')}`,
                        charset: voucher_codes.charset("numbers")
                    });

                    sequelize.transaction(function(t){
                        const { bankId, recipient, shipping } = req.body
                        return(
                            transaction.create({
                                orderId: generateOrderId[0],
                                userId: userObj.id,
                                bankId: bankId,
                                purchaseDate: moment(),
                                status: "pendingProof",
                                address: recipient.address,
                                kota: recipient.kota,
                                kodepos: recipient.kodepos,
                                firstname: recipient.firstname,
                                lastname: recipient.lastname,
                                phone: recipient.phone
                            }, { transaction: t })
                            .then((transactionObj) => {
                                var hardCount = 0
                                var softCount = 0
                                var free = 0
                                var subtotal = 0
                                var discount = 0
                                var totalPrice = 0
                                var arrItems = []
                                console.log(cartArr)
                                cartArr.forEach((item, index) => {
                                    var price = 0
                                    if(item.caseType === "soft" && item.catalogue.category === "normal"){
                                        price = priceSoft
                                        softCount += item.amount
                                    }
                                    if(item.caseType === "hard" && item.catalogue.category === "normal"){
                                        price = priceHard
                                        hardCount += item.amount
                                    }
                                    if(item.caseType === "soft" && item.catalogue.category === "custom"){
                                        price = priceSoftCustom
                                        softCount += item.amount
                                    }
                                    if(item.caseType === "hard" && item.catalogue.category === "custom"){
                                        price = priceHardCustom
                                        hardCount += item.amount
                                    }
                                    if(item.caseType === "premium"){
                                        price = pricePremium
                                        hardCount += item.amount
                                    }
                                    subtotal += price * item.amount
                                    arrItems.push({transactionId: transactionObj.id, catalogueId: item.catalogueId, phonemodelId: item.phonemodelId, name: item.catalogue.name, code: item.catalogue.code, category: item.catalogue.category, brand: item.brand, model: item.model, caseType: item.caseType, amount: item.amount, price: price})
                                })
                                
                                free = Math.floor((hardCount+softCount)/3)
                                console.log(hardCount, softCount, free)
                                for(i = free; i > 0; i--){
                                    console.log("loop")
                                    if(softCount > 0){
                                        console.log("-soft")
                                        softCount --
                                        discount += priceSoft
                                    }
                                    else if((softCount === 0) && hardCount > 0){
                                        console.log("-hard")
                                        hardCount --
                                        discount += priceHard
                                    }
                                }

                                totalPrice = subtotal - discount + shipping


                                return(
                                    transactionDetail.bulkCreate(arrItems, { transaction: t })
                                    .then((result) => {
                                        return (
                                            transactionObj.update({
                                                subtotal: subtotal,
                                                discount: discount,
                                                shipping: shipping,
                                                totalPrice: totalPrice
                                            }, { transaction: t })
                                            .then((result2) => {
                                                return(
                                                    cart.destroy({
                                                        where: {
                                                            userId: req.user.id
                                                        }
                                                    }, { transaction: t })
                                                    .then((result3) => {
                                                        return transactionObj
                                                    })
                                                )
                                            })
                                        )
                                    })
                                )
                            })
                        )
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: 'Purchase success',
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
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    transactionHistory(req, res){
        transaction.findAll({
            where: {
                userId : req.user.id
            },
            include: [
                {
                    model: transactionDetail,
                    required: false
                }
            ]
        })
        .then((transactionObj) => {
            return res.status(200).json({
                message: 'Get transaction history success',
                result: transactionObj
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    adminGetAllTransactions(req, res){
        transaction.findAll({
            include: [
                {
                    model: user,
                    attributes: [
                        "email",
                        "firstname",
                        "lastname",
                        "gender",
                        "phone",
                        "address",
                        "kota",
                        "kodepos",
                        "destination_code"
                    ]
                },
                {
                    model: transactionDetail
                }
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'Get transactions success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    }
}