const user = require('./userController');
const cart = require('./cartController');
const destination = require('./destinationController')
const catalogue = require('./catalogueController');
const transaction = require('./transactionController');
const linktree = require('./linktreeController');
const reseller = require('./resellerController');
const testimony = require('./testimonycontroller');
const brand = require('./brandController');
const phonemodel = require('./phonemodelController');
const price = require('./priceController');
const bank = require('./bankController');

module.exports = {
    user,
    cart,
    catalogue,
    destination,
    transaction,
    linktree,
    reseller,
    testimony,
    brand,
    phonemodel,
    price,
    bank
}