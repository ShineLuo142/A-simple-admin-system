var express=require('express');
var bodyParser = require('body-parser');
var app=express();
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty
var session = require("express-session");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;


app.set('view engine','ejs');
//配置session中间件
app.use(session({
    secret: 'this is session',  // sign the session ID cookie. 加密方式
    cookie:{
        //session的过期时间
        maxAge: 900000000
    }
}));
//静态web服务
app.use(express.static('static'));
app.use('/static',express.static('static'));
// 图片地址 static/upload/PBOqEnzwYYdiACMzdJwhA8jY.jpg
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var admin=require('./routers/admin.js');
var api=require('./routers/api.js');
var index=require('./routers/index.js');

app.use('/', index);
app.use('/admin', admin);
app.use('/api', api);

app.listen(3005);


