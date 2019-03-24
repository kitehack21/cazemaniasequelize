const { Sequelize, sequelize, catalogue, premium, phonemodel, premiumModel, premiumImage } = require('../models');
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
    getPremiumGroups(req, res){
        premium.findAndCountAll({
            offset: req.query.pagination * 20,
            limit: 20,
            order: [
                ["id", "DESC"]
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Premium Success',
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
    getPremiumCatalogue(req, res){
        catalogue.findAll({
            where: {
                premiumId: req.params.id
            }
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Premium Catalogue Success',
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
    getPremiumDetails(req, res){
        premium.findByPk(req.params.id, {
            include: [
                {
                    model: catalogue,
                    required: false,
                    include: [
                        {
                            model: phonemodel,
                            attributes: [
                                'id',
                                'name'
                            ],
                            through: { attributes: ["stock"] }
                        }
                    ]
                },
                {
                    model: premiumImage,
                    required: false
                }
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Admin Premium Details Success',
                result
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
    adminGetPremium(req, res){
        premium.findAll({
            include: [
                {
                    model: catalogue,
                    required: false
                },
                {
                    model: premiumImage,
                    required: false
                }
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Admin Premium Success',
                result
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    adminGetPremiumDetails(req, res){
        premium.findByPk(req.params.id, {
            include: [
                {
                    model: catalogue,
                    required: false,
                    include: [
                        {
                            model: phonemodel,
                            attributes: [
                                'id',
                                'name'
                            ],
                            through: { attributes: ["stock"] }
                        }
                    ]
                },
                {
                    model: premiumImage,
                    required: false
                }
            ]
        })
        .then((result) => {
            return res.status(200).json({
                message: 'GET Admin Premium Details Success',
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
                }
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
                console.log(code, name)
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
                    if(premiumImagePath){
                        fs.unlinkSync('./public' + premiumImagePath);
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
    },
    editPremiumGroup(req, res){
        premium.findByPk(req.params.id)
        .then(premiumObj => {
            if(!premiumObj){
                return res.status(404).json({
                    message: "Item not found",
                    error: `Premium with ID ${req.params.id} does not exist`
                })
            }

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
                            premiumObj.update({
                                name: name || premiumObj.name,
                                image: premiumImagePath || premiumObj.image,
                            }, { transaction: t })
                            .then((obj) => {
                                return obj
                            })
                        )
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: 'Premium Group Edit Successful',
                            result
                        })
                    })
                    .catch((err) => {
                        if(premiumImagePath){
                            fs.unlinkSync('./public' + premiumImagePath);
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
    addPremiumCatalogue(req, res){
        premium.findByPk(req.params.id)
        .then((premiumObj) => {
            if(!premiumModel){
                return res.status(404).json({
                    message: `Cannot find premium group with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }

            const { code, phonemodelIds } = req.body
            sequelize.transaction(function(t){
                return (
                    catalogue.create({
                        code: code,
                        name: premiumObj.name,
                        image: premiumObj.image,
                        premiumId: premiumObj.id,
                        category: "premium"
                    }, { transaction: t })
                    .then((catalogueObj) => {
                        return(
                            catalogueObj.setPhonemodels(phonemodelIds,
                                { transaction: t })
                            .then((models) => {
                                return catalogueObj
                            })
                        )
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
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    editPremiumStock(req, res){
        catalogue.findByPk(req.params.id,{
            include: [
                {
                    model: phonemodel
                }
            ]
        })
        .then((catalogueObj) => {
            if(!catalogueObj){
                return res.status(404).json({
                    message: `Cannot find catalogue with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }
            
            const { phonemodelIds, code } = req.body
            sequelize.transaction(function(t){
                return(
                    catalogueObj.update({
                        code: code || catalogueObj.code
                    })
                    .then((updatedCatalogueObj) => {
                        return(
                            catalogueObj.setPhonemodels(null)
                            .then((result) => {
                                console.log(result)
                                var promises = []

                                phonemodelIds.forEach((item, index) => {
                                    promises.push(catalogueObj.addPhonemodel(item.id, {through: {stock: item.stock}, transaction: t}))
                                })
                
                                return Promise.all(promises)
                            })
                        )
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: `Edit Stock success`,
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
    addPremiumImage(req, res){
        const path = '/premium'; //file save path
        const upload = uploader(path, 'PRM').fields([{ name: 'premium'}]); //uploader(path, 'default prefix')
        upload(req, res, (err) => {
            if(err){
                console.log(err.message)
                return res.status(500).json({ message: 'Upload image failed !', error: err.message });
            }
            
            const { premium } = req.files;
            const premiumPath = premium ? path + '/' + premium[0].filename : null;
            
            try {
                sequelize.transaction(function(t){
                    return (
                        premiumImage.create({
                            premiumId: req.params.id,
                            image: premiumPath,
                        }, { transaction: t })
                        .then((obj) => {
                            return obj
                        })
                    )
                })
                .then((result) => {
                    return res.status(200).json({
                        message: 'Premium Image Add Successful',
                        result
                    })
                })
                .catch((err) => {
                    if(premiumPath){
                        fs.unlinkSync('./public' + premiumPath);
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
    },
    editPremiumImage(req, res){
        premiumImage.findByPk(req.params.id)
        .then((premiumImageObj) => {
            if(!premiumImageObj){
                return res.status(404).json({
                    message: `Cannot find premium image with Id ${req.params.id}`,
                    error: 'Item not found'
                })
            }

            const path = '/premium'; //file save path
            const upload = uploader(path, 'PRM').fields([{ name: 'premium'}]); //uploader(path, 'default prefix')
            upload(req, res, (err) => {
                if(err){
                    console.log(err.message)
                    return res.status(500).json({ message: 'Upload image failed !', error: err.message });
                }
                
                const { premium } = req.files;
                const premiumPath = premium ? path + '/' + premium[0].filename : null;
                
                try {
                    if(premiumPath && premiumImageObj.image){
                        fs.unlinkSync('./public' + premiumImageObj.image);
                    }
                    
                    sequelize.transaction(function(t){
                        return (
                            premiumImageObj.update({
                                image: premiumPath,
                            }, { transaction: t })
                            .then((obj) => {
                                return obj
                            })
                        )
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: 'Premium Image Add Successful',
                            result
                        })
                    })
                    .catch((err) => {
                        if(premiumPath){
                            fs.unlinkSync('./public' + premiumPath);
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
    },
    getPremiumStock(req ,res){
        catalogue.findAll({
            include: [
                {
                    model: phonemodel,
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