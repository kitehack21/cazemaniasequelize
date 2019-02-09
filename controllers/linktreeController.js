const { Sequelize, sequelize, linktree } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
const Op = Sequelize.Op

module.exports = {
    //Get Links
    getLinks(req, res){
        linktree.findAll()
         .then((result) => {
            return res.status(404).json({
                message: "Get links success",
                result
            })
         })
         .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },   
}