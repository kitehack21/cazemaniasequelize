const user = require('./userController');
const cart = require('./cartController');
const destination = require('./destinationController')
const catalogue = require('./catalogueController');
const transaction = require('./transactionController')
const linktree = require('./linktreeController')
const testimony = require('./testimonycontroller')
const brand = require('./brandController')
const phonemodel = require('./phonemodelController')

module.exports = {
    user,
    cart,
    catalogue,
    destination,
    transaction,
    linktree,
    testimony,
    brand,
    phonemodel
}