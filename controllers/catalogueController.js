const { Sequelize, sequelize, catalogue, premium, model, premiumModel } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get Top 12 Bestsellers
    bestsellers(req, res){
        catalogue.findAll({
            limit: 12,
            where: {
                category : {
                    [Op.ne] : "custom",
                    [Op.ne] : "premium"
                }
            },
            order: [
                ["sales", "DESC"]
            ]
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
    //Get Catalogue with pagination and search parameters
    getCatalogue(req, res){
        catalogue.findAndCountAll({
            offset: req.query.pagination * 20,
            limit: 20,
            where: {
                category : "normal",
                [Op.or]: [
                    {
                        code: {
                            [Op.like]: `%${req.query.search}%`
                        }
                    },
                    {
                        name: {
                            [Op.like]: `%${req.query.search}%`
                        }
                    }
                ]
            },
            order: [
                ["id", "DESC"]
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Catalogue Success',
                result: {
                    data: result.rows,
                    count: result.count
                }
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    //Get Catalogue for admin
    adminGetCatalogue(req, res){
        catalogue.findAll({
            where: {
                category : "normal",
            },
            order: [
                ["id", "DESC"]
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Admin Catalogue Success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    getSimilarProducts(req, res){
        catalogue.findByPk(req.params.id)
        .then((catalogueObj) => {
            if(!catalogueObj){
                return res.status(404).json({
                    message: "Item not found",
                    error: `Product with ID ${req.params.id} does not exist`
                })
            }

            catalogue.findAll({
                limit: 5,
                where: {
                    name: {
                        [Op.like] : `%${catalogueObj.name}%`
                    },
                    id: {
                        [Op.ne]: req.params.id
                    }
                },
                order: [
                    ["id", DESC]
                ]
            })
            .then((result) => {
                return res.status(200).json({
                    message: 'GET Similar Products Success',
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
    getProduct(req, res){
        catalogue.findByPk(req.params.id)
        .then((result) => {
            if(!result){
                return res.status(404).json({
                    message: "Item not found",
                    error: `Product with ID ${req.params.id} does not exist`
                })
            }

            return res.status(200).json({
                message: 'GET Product Success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    addCatalogue(req, res){
        const path = '/normal'; //file save path
        const upload = uploader(path, 'NRM').fields([{ name: 'normalImage'}]); //uploader(path, 'default prefix')
        upload(req, res, (err) => {
            if(err){
                console.log(err.message)
                return res.status(500).json({ message: 'Upload image failed !', error: err.message });
            }
            
            const { normalImage } = req.files;
            const { code, name } = req.body
            const normalImagePath = normalImage ? path + '/' + normalImage[0].filename : null;
            
            try {
                sequelize.transaction(function(t){
                    return (
                        catalogue.create({
                            code: code,
                            name: name,
                            image: normalImagePath,
                            category: "normal"
                        }, { transaction: t})
                        .then((catalogueObj) => {
                            return catalogueObj
                        })
                    )
                })
                .then((result) => {
                    return res.status(200).json({
                        message: 'Catalogue Creation Successful',
                        result
                    })
                })
                .catch((err) => {
                    fs.unlinkSync('./public' + normalImagePath);
                    console.log(err.message)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
            catch(err){
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
        })
    },
    editCatalogue(req, res){
        catalogue.findByPk(req.params.id)
        .then((catalogueObj) => {
            if(!catalogueObj){
                return res.status(404).json({
                    message: `Cannot find catalogue with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }
            const path = '/normal'; //file save path
            const upload = uploader(path, 'NRM').fields([{ name: 'normalImage'}]); //uploader(path, 'default prefix')
            upload(req, res, (err) => {
                if(err){
                    console.log(err.message)
                    return res.status(500).json({ message: 'Upload image failed !', error: err.message });
                }
                
                const { normalImage } = req.files;
                const { code, name } = req.body
                const normalImagePath = normalImage ? path + '/' + normalImage[0].filename : null;
                console.log(normalImage, normalImagePath)
                try {
                    if(normalImagePath && catalogueObj.image){
                        fs.unlinkSync('./public' + catalogueObj.image);
                    }
                    sequelize.transaction(function(t){
                        return (
                            catalogueObj.update({
                                code: code || catalogueObj.code,
                                name: name || catalogueObj.name,
                                image: normalImagePath || catalogueObj.image,
                                category: "normal"
                            }, { transaction: t})
                            .then((updatedCatalogueObj) => {
                                return updatedCatalogueObj
                            })
                        )
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: 'Catalogue Update Successful',
                            result
                        })
                    })
                    .catch((err) => {
                        if(normalImagePath){
                            fs.unlinkSync('./public' + normalImagePath);
                        }
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    })
                }
                catch(err){
                    console.log(err.message)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                }
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    addPremiumGroup(req, res){
        const path = '/premium'; //file save path
        const upload = uploader(path, 'PRM').fields([{ name: 'premiumImage'}]); //uploader(path, 'default prefix')
        upload(req, res, (err) => {
            if(err){
                console.log(err.message)
                return res.status(500).json({ message: 'Upload image failed !', error: err.message });
            }
            
            const { premiumImage } = req.files;
            const { name } = req.body
            const premiumImagePath = premiumImage ? path + '/' + premiumImage[0].filename : null;
            
            try {
                sequelize.transaction(function(t){
                    return (
                        premium.create({
                            name: name,
                            image: premiumImagePath,
                        }, { transaction: t })
                        .then((obj) => {
                            return obj
                        })
                    )
                })
                .then((result) => {
                    return res.status(200).json({
                        message: 'Premium Group Creation Successful',
                        result
                    })
                })
                .catch((err) => {
                    fs.unlinkSync('./public' + premiumImagePath);
                    console.log(err.message)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
            catch(err){
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
        })
    },
    addPremiumCatalogue(req, res){
        const path = '/premium'; //file save path
        const upload = uploader(path, 'PRM').fields([{ name: 'premiumImage'}]); //uploader(path, 'default prefix')
        upload(req, res, (err) => {
            if(err){
                console.log(err.message)
                return res.status(500).json({ message: 'Upload image failed !', error: err.message });
            }
            
            const { premiumImage } = req.files;
            const { code, name } = req.body
            const premiumImagePath = premiumImage ? path + '/' + premiumImage[0].filename : null;
            
            try {
                sequelize.transaction(function(t){
                    return (
                        catalogue.create({
                            code: code,
                            name: name,
                            image: premiumImagePath,
                            category: "premium"
                        }, { transaction: t })
                        .then((obj) => {
                            return obj
                        })
                    )
                })
                .then((result) => {
                    return res.status(200).json({
                        message: 'Premium Catalogue Creation Successful',
                        result
                    })
                })
                .catch((err) => {
                    fs.unlinkSync('./public' + premiumImagePath);
                    console.log(err.message)
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
            catch(err){
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            }
        })
    },
    getPremiumStock(req ,res){
        catalogue.findAll({
            include: [
                {
                    model: model,
                    attributes: [
                        'id',
                        'name'
                    ],
                    through: { attributes: ["stock"] }
                }
            ],
        })
        .then((result) => {
            return res.status(200).json({
                message: 'Premium Catalogue Creation Successful',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
}