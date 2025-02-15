const { generateHash, compareHash, decrypt } = require('../helpers').encryption;
const { createJWTToken } = require('../helpers').jwt;
const { sequelize, user, admin } = require('../models');
const { validate } = require("../helpers").validator;
var moment = require('moment')
var fs = require('fs');
var { uploader } = require('../helpers').uploader
var { emailer } = require('../helpers').emailer;

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
                        const token = createJWTToken({ id: result.id, category: result.category });
                        return res.status(200).json({
                            message: 'Registration Successful',
                            result: {
                                token,
                                email: result.email,
                                firstname: result.firstname,
                                lastname: result.lastname,
                                category: result.category,
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
                            category: result.category,
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
        user.findByPk(req.user.id)
        .then((userObj) => {
            const token = createJWTToken({ id: userObj.id });
            if(!userObj){
                return res.status(404).json({ message: 'User not found !' });
            }
            else{
                return res.status(200).json({
                    message: `GET User Data Successful`,
                    result: {
                        token,
                        email: userObj.email,
                        firstname: userObj.firstname,
                        lastname: userObj.lastname,
                        category: userObj.category,                          
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
        })
    },
    getProfile(req, res){
        user.findByPk(req.user.id)
        .then((userObj) => {
            if(!userObj){
                return res.status(404).json({ message: 'User not found !' });
            }
            else{
                return res.status(200).json({
                    message: `GET User Profile Successful`,
                    result: userObj
                });
            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
        })
    },
    //Edit User Profile
    editProfile(req, res){
        var { gender, phone, address, kota, kodepos, destination_code} = req.body;
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
    },
    editProfilePicture(req,res){
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
    },
    changePassword(req, res){
        var {password, newPassword} = req.body;
        var dp = decrypt(password) //decrypted password
        var np = decrypt(newPassword)    //decrpyted new password

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
    },
    adminLogin(req, res){
        var { username, ep } = req.body
        var dp = decrypt(ep) //decrypted password
        return(
            admin.findOne({where: {username : username}})
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
                            username: result.username,
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
    newPassword(req, res){
        var { ep } = req.body;
        var np = decrypt(ep)    //decrpyted new password

        user.findByPk(req.user.id)
        .then((userObj) => {
            if(!userObj){
                return res.status(404).json({ message: 'User not found !' });
            }

            if(req.user.hash !== userObj.password){
                return res.status(400).json({ message: 'This link is no longer valid !' });
            }

            sequelize.transaction(function(t){
                return(
                    userObj.update({
                        password: generateHash(np)
                    })
                    .then((result) => {
                        return res.status(200).json({
                            message: `New Password Success`
                        });
                    })
                )
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
    requestChangePassword(req, res){
        user.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((userObj) => {
            if(!userObj){
                console.log('no user')
                return res.status(404).json({ message: 'User not found !' });
            }

            var subject = "Reset Password Account Cazemania"
            const confirmationToken = createJWTToken({ id: userObj.id, hash: userObj.password });
            var replacements = {
                verificationLink: `http://cazemania.id/reset?ide=${confirmationToken}`
            }
            var attachments = [
                {
                    filename: 'logo.png',
                    path: './public/others/logo.png',
                    cid: 'cazemanialogo'
                },
            ]

            try{
                emailer(userObj.email, subject, "./email/reset.html", replacements, attachments)
                return res.status(200).json({
                        message: `Request change success`
                    })
            }
            catch(err){
                console.log(err, "error")
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
            }
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
        })
    },
    createAdmin(req, res){

        const { username, password } = req.body
        admin.findOne({
            where: {
                username: username
            }
        })
        .then((adminObj) => {
            if(adminObj){
                return res.status(404).json({ message: 'Username already exists !' });
            }

            sequelize.transaction(function(t){
                return(
                    admin.create({
                        username: username,
                        password: generateHash(password)
                    })
                    .then((createdAdmin) => {
                        return createdAdmin
                    })
                )
            })
            .then((result) => {
                return res.status(200).json({
                    message: `Create admin success`,
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
    adminKeepLogin(req, res){
        admin.findByPk(req.user.id)
        .then((adminObj) => {
            if(!adminObj){
                console.log('no user')
                return res.status(404).json({ message: 'User not found !' });
            }

            const token = createJWTToken({ id: adminObj.id });
            return res.status(200).json({
                message: `Keep login success`,
                result: {
                    token,
                    username: adminObj.username
                }
            })
        })
        .catch((err) => {
            console.log(err.message)
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message }); 
        })
    }
}