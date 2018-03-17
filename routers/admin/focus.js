var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty
var DB=require('./../../module/db.js');
router.get('/',function(req,res){
    DB.find('focus',{},function(docs){
        //console.log(docs);
        res.render('admin/focus/index',{
            list:docs
        })
    })
})
//增加轮播图：
router.get('/add',function(req,res){
    res.render('admin/focus/add');
})
router.post('/doAdd',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var url =fields.url[0];
        var title =fields.title[0];
        var description=fields.description[0];
        var status=fields.status[0]
        var pic=files.pic[0].path;
        DB.insert('focus', {
            'url':url,
            'pic':pic,
            'title':title,
            'status':status,
            'description':description,
        },function (err) {
            if(!err){
                res.redirect('/admin/focus/')
            }
        })
    })

})
//编辑轮播图：
router.get('/edit',function(req,res){
    //console.log(req.query)
    var id=req.query.id
    DB.find('focus',{'_id':new DB.ObjectId(id)},function(docs){
        res.render('admin/focus/edit',{
            list:docs[0]
        })
    })
});
router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var id= fields.id[0]
        var url =fields.url[0];
        var title =fields.title[0];
        var description=fields.description[0];
        var status=fields.status[0]
        var pic=files.pic[0].path;
        if(files.pic[0].originalFilename==''){
            var json= {
                'url':url,
                'title':title,
                'status':status,
                'description':description,
            }
        }else{
            var json= {
                'url':url,
                'pic':pic,
                'title':title,
                'status':status,
                'description':description,
            }
        }
        DB.update('focus',{'_id':new DB.ObjectId(id)},json, function () {
            if(!err){
                res.redirect('/admin/focus/')
            }
        })
    })
});
//删除轮播图：
router.get('/delate',function(req,res){
    var id=req.query.id
    DB.find('focus',{'_id':new DB.ObjectId(id)},function(docs){
        res.render('admin/focus/delate',{
            list:docs[0]
        })
    })
});
router.post('/doDelate',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var id= fields.id[0]
        DB.remove('focus',{'_id':new DB.ObjectId(id)}, function () {
            if(!err){
                res.redirect('/admin/focus/')
            }
        })
    })
});
module.exports = router;


