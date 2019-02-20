const { generateHash, compareHash, decrypt } = require('../helpers').encryption;
const { createJWTToken } = require('../helpers').jwt;
const { sequelize, user } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader

module.exports = {
    //User Registration
    register(req, res){
        var { email, ep, firstname, lastname, gender, phone,
              address, kota, kodepos, destination_code  } = req.body
        var dp = decrypt(ep) //decrypted password   
        var results = validate(req.body)
        if(results.length > 0){
            return res.status(422).send({message: "Invalid Form", results})
        }
        else{
            return (
                user.findOne({where: {email : email}})
                .then((obj) => {
                    if(obj){
                        return res.status(400).json({ message: 'Email already exists!' });
                    }

                    sequelize.transaction(function(t){
                        return (
                            user.create({
                                firstname, 
                                lastname,
                                email, 
                                password: generateHash(dp), 
                                gender,
                                phone,  
                                address,
                                kota,
                                kodepos,
                                destination_code,
                                category: "customer",
                                lastLogin: moment()
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
                        const token = createJWTToken({ id: result.id, role: result.role });
                        return res.status(200).json({
                            message: 'Registration Successful',
                            result: {
                                token,
                                email: result.email,
                                firstname: result.firstname,
                                lastname: result.lastname,
                                role: result.role,
                            }
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
            )
        }
    },
    //User Login
    login(req, res){
        var { email, ep } = req.body
        var dp = decrypt(ep) //decrypted password
        return(
            user.findOne({where: {email : email}})
            .then((obj) => {
                if(!obj){
                    console.log('User not found !')
                    return res.status(404).json({ message: 'User not found !' });
                }
                if(!compareHash(dp, obj.password)) {
                    console.log("Password didn't match!")
                    return res.status(401).json({ message: "Password didn't match !" });
                }
                obj.update({
                    lastLogin: moment()
                })
                .then((result) => {
                    const token = createJWTToken({ id: obj.id });
                    return res.status(200).json({
                        message: 'Registration Successful',
                        result: {
                            token,
                            email: result.email,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            role: result.role,
                        }
                    });
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
        )
    },
    //Keep Login / Get Dashboard Data
    getUserData(req, res){
        return(
            user.findByPk(req.user.id)
            .then((obj) => {
                const token = createJWTToken({ id: obj.id });
                if(!obj){
                    return res.status(404).json({ message: 'User not found !' });
                }
                else{
                    return res.status(200).json({
                        message: `GET User Data Successful`,
                        result: {
                            token,
                            email: result.email,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            role: result.role,                          
                        }
                    });
                }
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
            })
        )
    },
    //Edit User Profile
    editProfile(req, res){
        var { gender, phone, address, kota, kodepos} = req.body;
        return(
            user.findByPk(req.user.id)
            .then((obj) => {
                if(!obj){
                    return res.status(404).json({ message: 'User not found !' });
                }

                sequelize.transaction(function(t){
                    return(
                        obj.update({
                            gender: gender || obj.gender,
                            phone: phone || obj.phone,
                            address: address || obj.address,
                            destination_code: destination_code || obj.destination_code,
                            kota: kota || obj.kota,
                            kodepos: kodepos || obj.kodepos,
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
                    const token = createJWTToken({ id: obj.id });
                    return res.status(200).json({
                        message: `Edit Profile Successful`,
                        result: {
                            token,
                            email: result.email,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            phone: result.phone
                        }
                    });
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
        )
    },
    editProfilePicture(req,res){
        return(
            user.findByPk(req.user.id)
            .then((obj) => {
                if(!obj){
                    return res.status(404).json({ message: 'User not found !' });
                }

                const path = '/files/profile'; //file save path
                const upload = uploader(path, 'PRF').fields([{ name: 'profile'}]); //uploader(path, 'default prefix')

                upload(req, res, (err) => {
                    if(err){
                        return res.status(500).json({ message: 'Upload profile picture failed !', error: err.message });
                    }

                    var defaultProfilePicture = `/files/profile/default.png` //default profile picture path
                    const { profile } = req.files;
                    console.log(profile)
                    const profilePath = profile ? path + '/' + profile[0].filename : null;
                    
                    try {
                        if(profilePath && obj.profilePicture !== defaultProfilePicture ) {
                            fs.unlinkSync('./public' + obj.profilePicture);
                        }
    
                        sequelize.transaction(function(t){
                            return(
                                obj.update({
                                    profilePicture: profilePath || obj.profilePicture
                                }, { transaction: t })
                                .then((result) => {
                                    return result
                                })
                                .catch((err) => {
                                    fs.unlinkSync('./public' + profilePath);
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
                                }) 
                            )
                        })
                        .then((result) => {
                            const token = createJWTToken({ id: obj.id });
                            return res.status(200).json({
                                message: `Edit Profile Picture Successful`,
                                result: {
                                    token,
                                    profilePicture: result.profilePicture
                                }
                            });
                        })
                        .catch((err) => {
                            fs.unlinkSync('./public' + profilePath);
                            console.log(err.message)
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                        })
                    }
                    catch(err){
                        fs.unlinkSync('./public' + profilePath);
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            })
            .catch((err) => {
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
            })
        )
    },
    changePassword(req, res){
            var {password, newPassword} = req.body;
            var dp = decrypt(password) //decrypted password
            var np = decrypt(newPassword)    //decrpyted new password
        return(
            user.findByPk(req.user.id)
            .then((obj) => {
                if(!obj){
                    return res.status(404).json({ message: 'User not found !' });
                }
                if(!compareHash(dp, obj.password)) {
                    return res.status(401).json({ message: "Password didn't match !" });
                }
                obj.update({
                    password: generateHash(np) || obj.password
                })
                .then((result) => {
                    return res.status(200).json({
                        message: `Change Password Success`
                    });
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
        )
    }
}