const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const key = require('../config.js').appKey
const saltRounds = 10;

module.exports = {
    encrypt(data){
        let cipher = crypto.createCipher('aes192', key);
        let crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');
    
        return crypted;
    },
    decrypt(data){
        console.log(data, "this is data")
        let decipher = crypto.createDecipher('aes192', key);
        let decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
    
        return decrypted;
    },
    generateHash(data){
        let result = bcrypt.hashSync(data, saltRounds);
        return result;
    },
    compareHash(val1, val2){
        let result = bcrypt.compareSync(val1, val2);
        return result;
    }
}
// export const encrypt = (key, data) => {
//     let cipher = crypto.createCipher('aes192', key);
//     let crypted = cipher.update(data, 'utf-8', 'hex');
//     crypted += cipher.final('hex');

//     return crypted;
// }

// export const decrypt = (key, data) => {
//     let decipher = crypto.createDecipher('aes192', key);
//     let decrypted = decipher.update(data, 'hex', 'utf-8');
//     decrypted += decipher.final('utf-8');

//     return decrypted;
// }

// export const generateHash = (data) => {
//     let result = bcrypt.hashSync(data, saltRounds);
//     return result;
// }

// export const compareHash = (val1, val2) => {
//     let result = bcrypt.compareSync(val1, val2);
//     return result;
// }