const adminRouter = require('./adminRouter');
const authRouter = require('./authRouter');
const catalogueRouter = require('./catalogueRouter')
const transactionRouter = require('./transactionRouter')
const linktreeRouter = require('./linktreeRouter')
const destinationRouter = require('./destinationRouter')
const testimonyRouter = require('./testimonyRouter')
const brandRouter = require('./brandRouter')
const phonemodelRouter = require('./phonemodelRouter')
const priceRouter = require('./priceRouter')

module.exports = {
    adminRouter,
    authRouter,
    catalogueRouter,
    transactionRouter,
    linktreeRouter,
    destinationRouter,
    testimonyRouter,
    brandRouter,
    phonemodelRouter,
    priceRouter
}