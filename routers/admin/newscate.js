var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty
var DB=require('./../../module/db.js');

router.get('/',function(req,res){
    DB.find('newscate',{},function(docs){
        //console.log(docs);
        res.render('admin/newscate/index',{
            list:docs
        })
    })
})
//增加新闻分类列表：
router.get('/add',function(req,res){
    res.render('admin/newscate/add');
})
router.post('/doAdd',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var title =fields.title[0];
        var description=fields.description[0];
        var status=fields.status[0]
        DB.insert('newscate', {
            'title':title,
            'status':status,
            'description':description,
        },function (err) {
            if(!err){
                res.redirect('/admin/newscate/')
            }
        })
    })

})

//编辑新闻分类：
router.get('/edit',function(req,res){
    //console.log(req.query)
    var id=req.query.id
    DB.find('newscate',{'_id':new DB.ObjectId(id)},function(docs){
        //console.log(docs)
        res.render('admin/newscate/edit',{
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
        var title =fields.title[0];
        var description=fields.description[0];
        var status=fields.status[0];
            var json= {
                'title':title,
                'status':status,
                'description':description,
            }
        DB.update('newscate',{'_id':new DB.ObjectId(id)},json, function () {
            if(!err){
                res.redirect('/admin/newscate/')
            }
        })
    })
});
//删除新闻分类：
router.get('/delate',function(req,res){
    //console.log(req.query)
    var id=req.query.id
    DB.find('newscate',{'_id':new DB.ObjectId(id)},function(docs){
        //console.log(docs)
        res.render('admin/newscate/delate',{
            list:docs[0]
        })
    })
});
router.post('/doDelate',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        var id= fields.id[0]
        DB.remove('newscate',{'_id':new DB.ObjectId(id)}, function () {
            if(!err){
                res.redirect('/admin/newscate/')
            }
        })
    })
});
module.exports = router;


