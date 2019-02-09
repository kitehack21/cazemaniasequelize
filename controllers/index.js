const user = require('./userController');
const cart = require('./cartController');
const catalogue = require('./catalogueController');
const transaction = require('./transactionController')
const linktree = require('./linktreeController')

module.exports = {
    user,
    cart,
    catalogue,
    transaction,
    linktree
}