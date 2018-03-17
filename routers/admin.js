var express = require('express');
var router = express.Router();
//var md5=require('md5');
var DB=require('./../module/db.js');
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty



var user=require('./admin/user.js');
var news=require('./admin/news.js');
var focus=require('./admin/focus.js');
var newscate=require('./admin/newscate.js');



//配置是否登录：
//router.use(function(req,res,next){
//    if(req.session.admInformation){
//        next()
//    }else{
//        if(req.url=="/login" || req.url=="/doLogin"){
//            next();
//        }else{
//            res.redirect('login')
//        }
//    }
//})


//登录路由：
router.get('/login',function(req,res){
    res.render('admin/login')
})
router.post('/doLogin',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files)
        DB.find('adnin',{
            'name':fields.username[0],
            'password':fields.password[0]
        },function(docs){
            //console.log(docs)
            if(docs.length>0){
                req.session.admInformation=docs[0];
                res.redirect('/admin/user/')
            }else{
                res.send('<script>alert("用户名或者密码不正确");location.href="login"</script>')
            }
        })
    })
})

router.get('/loginOut',function(req,res){
    req.session.admInformation='';
    res.redirect('login')

})




router.use('/user',user);
router.use('/news',news);
router.use('/focus',focus);
router.use('/newscate',newscate);


module.exports = router;



