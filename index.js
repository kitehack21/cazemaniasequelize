const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

var config = require ('./config.js');
const bearerToken = require('express-bearer-token');

const port = process.env.PORT || config.port;

var app = express({defaultErrorHandler:false});

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bearerToken());

app.use(express.json({ limit: '300kb' }));

app.set('etag', false);
app.use((req, res, next) => {
    console.log()
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Authorization, Content-Length, Cache-Control, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token');
    next();
});

var models = require('./models')
const {
    adminRouter,
    authRouter,
    transactionRouter,
    catalogueRouter,
    linktreeRouter,
    destinationRouter
} = require('./routers')


models.sequelize.sync()
.then(function(){
    console.log("Database looks fine")
})
.catch(function(err){
    console.log(err, "Something wrong with database update")
})

app.get('/', function(req,res){
    res.send("Welcome to Cazemania API v0.01")
})

app.use("/admin", adminRouter)
app.use("/auth", authRouter)
app.use("/catalogue", catalogueRouter)
app.use("/transaction", transactionRouter)
app.use("/linktree", linktreeRouter)
app.use('/destination', destinationRouter)



app.listen(port, () => console.log(`App listening on port ${port}!`));