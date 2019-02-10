const adminRouter = require('./adminRouter');
const authRouter = require('./authRouter');
const catalogueRouter = require('./catalogueRouter')
const transactionRouter = require('./transactionRouter')
const linktreeRouter = require('./linktreeRouter')
const destinationRouter = require('./destinationRouter')

module.exports = {
    adminRouter,
    authRouter,
    catalogueRouter,
    transactionRouter,
    linktreeRouter,
    destinationRouter
}