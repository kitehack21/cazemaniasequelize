const { Sequelize, sequelize, user, cart, transaction, transactionDetails } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader, mailer  } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get User's cart
    getUserCart(req, res){
        cart.findAll({
            where: {
                userId: req.params.id
            },
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Bestsellers Success',
                result
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
                const { catalogueId, brandId, modelId, case_type, amount } = req.body
                return(
                    cart.findOrCreate({
                        userId: userObj.id,
                        catalogueId: catalogueId,
                        brandId: brandId,
                        model: modelId,
                        case_type: case_type
                    }, { transaction: t })
                    .then((arr) => {
                        console.log(arr)
                        //checks if "created" is false
                        if(arr[1] === false){
                            return(
                                arr[0].update({
                                    amount: arr[0].amount + amount
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
                                arr[0].update({
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
                            }, { transaction: t })
                            .then((result) => {
                                return result
                            })
                            .catch((err) => {
                                fs.unlinkSync('./public' + proofPath);
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
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
                        fs.unlinkSync('./public' + proofPath);
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
                        "firstName",
                        "lastName"
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
                        return result
                    })
                    .catch((err) => {
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    })
                )
            })
            .then((result) => {
                const { email } = transactionObj.user
                const mailOptions = {
                    from: 'cazemania.official@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: 'Pembayaran Telah Dikonfirmasi', // Subject line
                    html: 
                        `<p>
                        Hai Kak ________ (nama),

                        Terimakasih karena telah melakukan pembayaran untuk pesanan dengan order ID: ______ (ini kalo di klik langsung ke halaman order dia gitu bisa ga)?
                        
                        
                        Pembayaran kakak sudah kami terima. Harap menunggu kurang lebih 7-14 hari kerja (tidak termasuk tanggal merah & hari Minggu) karena pesanan case akan kami proses cetak terlebih dahulu.
                        
                        
                        
                        Cheers,
                        
                        Admin Cazemania
                        </p>`
                }
                mailer.sendMail(mailOptions, function (err, info) {
                    if(err)
                        console.log(err)
                    else
                        console.log(info);
                })

                return res.status(200).json({
                    message: 'Confirmation of Proof Success',
                    result
                })
            })
            .catch((err) => {
                console.log(err.message)
                fs.unlinkSync('./public' + proofPath);
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
                    model: transactionDetails
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
                    })
                    .then((result) => {
                        const { transactionDetails } = transactionObj
                        var updated = []

                        updated = transactionDetails.map((item, index) => {
                            catalogue.increment(
                                {
                                    sales: item.amount
                                },
                                {
                                    where: {
                                        catalogueId: item.catalogueId
                                    }
                                }
                            )
                            .then((result) => {
                                return result
                            })
                            .catch((err) => {
                                console.log(index)
                                console.log(err.message)
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            })
                        })

                        return updated
                    })
                    .catch((err) => {
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    })
                )
            })
            .then((result) => {

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
                }
            })
            .then((cartArr) => {
                if(!cartArr){
                    return res.status(404).json({
                        message: "Cart is empty!"
                    })
                }
            })

            sequelize.transaction(function(t){
                const { bankId, address, kota, kodepos, firstname, lastname, phone } = req.body
                var subtotal = 0
                var discount = 0
                var shipping = 0
                var totalPrice = 0
                return(
                    transaction.create({
                        userId: userObj.id,
                        bankId: bankId,
                        purchaseDate: moment(),
                        subtotal: subtotal,
                        discount: discount,
                        shipping: shipping,
                        totalPrice: totalPrice,
                        status: "pendingProof",
                        address: address,
                        kota: kota,
                        kodepos: kodepos,
                        firstname: firstname,
                        lastname: lastname,
                        phone: phone
                    }, { transaction: t })
                    .then((arr) => {
                        console.log(arr)
                        //checks if "created" is false
                        if(arr[1] === false){
                            return(
                                arr[0].update({
                                    amount: arr[0].amount + amount
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
                                arr[0].update({
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
    }
}