var express = require('express');
var router = express.Router();
var DB=require('./../../module/db.js');
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty

//首页路由：加载后台数据显示到页面
router.get('/',function(req,res){
    //res.send('njjj');
    DB.find('user',{},function(docs){
        //console.log(docs);
        res.render('admin/user/index',{
            list:docs
        })
    })
})

//add:增加用户
router.get('/add',function(req,res){
    res.render('admin/user/add')
})
router.post('/doAdd',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var name =fields.name[0];
        var age=fields.age[0];
        var sex=fields.sex[0];
        var classname=fields.classname[0];
        var description=fields.description[0];
        var face=files.face[0].path;
        DB.insert('user', {
            'name':name,
            'age':age,
            'sex':sex,
            'classname':classname,
            'description':description,
            'face':face
        },function (err) {
            if(!err){
                res.redirect('/admin/user/')
            }
        })
    })

})
//编辑用户：
router.get('/edit',function(req,res){
    //console.log(req.query)
    var id=req.query.id
    DB.find('user',{'_id':new DB.ObjectId(id)},function(docs){
        res.render('admin/user/edit',{
            list:docs[0]
        })
    })
});
router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var name =fields.name[0];
        var age=fields.age[0];
        var sex=fields.sex[0];
        var classname=fields.classname[0];
        var description=fields.description[0];
        var face=files.face[0].path;
        var id=fields.id[0];
        if(files.face[0].originalFilename==''){
            var json= {
                'name':name,
                'age':age,
                'sex':sex,
                'classname':classname,
                'description':description,
            }
        }else{
            var json= {
                'name':name,
                'age':age,
                'sex':sex,
                'classname':classname,
                'description':description,
                'face':face
            }
        }
        DB.update('user',{'_id':new DB.ObjectId(id)},json, function () {
            if(!err){
                res.redirect('/admin/user/')
            }
        })
    })
})
//删除用户：
router.get('/delate',function(req,res){
    var id=req.query.id
    DB.find('user',{'_id':new DB.ObjectId(id)},function(docs){
        res.render('admin/user/delate',{
            list:docs[0]
        })
    })
})
router.post('/doDelate',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var id=fields.id[0];
        DB.remove('user',{'_id':new DB.ObjectId(id)},function () {
            if(!err){
                res.redirect('/admin/user/')
            }
        })
    })
})
module.exports = router;


