var express = require('express');
var router = express.Router();
var async = require('async');
var multiparty = require('multiparty');//post 以及图片上传的模块multiparty
var DB=require('./../../module/db.js');

router.get('/',function(req,res){
    var page=req.query.page ||1;
    var pageSize=6;
    //console.log(page);
    async.parallel({
        news: function(callback) {
            DB.find('news',{},{},{
                page:page,
                pageSize:pageSize
            },function(docs){
                callback(null,docs)
            })
        },
        newscate: function(callback) {
            DB.find('newscate',{},function(docs){
                callback(null,docs)
            })
        },
        newsCount:function(cb){
            DB.count('news',{},function(data){
                cb(null,data)
            })
        }
    }, function(err, results) {
        //console.log(results);
        res.render('admin/news/index',{
            list:results.news,
            newscate:results.newscate,
            newsCount:Math.ceil(results.newsCount/pageSize),
            page:page
        })
    });

})
//增加新闻：
router.get('/add',function(req,res){
    DB.find('newscate',{},function(docs){
        //console.log(docs);
        res.render('admin/news/add',{
            newscate:docs
        })
    })
})
router.post('/doAdd',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var title =fields.title[0];
        var author =fields.author[0];
        var cid =fields.cid[0];
        var cidName=fields.catename[0]
        var keywords =fields.keywords[0];
        var discription =fields.discription[0];
        var content =fields.content[0];
        var pic=files.pic[0].path;
        DB.insert('news', {
            'title':title,
            'author':author,
            'cid':cid,
            'cidName':cidName,
            'keywords':keywords,
            'discription':discription,
            'content':content,
            'pic':pic,
        },function (err) {
            if(!err){
                res.redirect('/admin/news/')
            }
        })
    })

})
//编辑新闻：
router.get('/edit',function(req,res){
    async.parallel({
        news: function(callback) {
            var id=req.query.id;
            DB.find('news',{'_id':new DB.ObjectId(id)},function(docs){
                callback(null,docs[0])
            })
        },
        newscate: function(callback) {
            DB.find('newscate',{},function(docs){
                callback(null,docs)
            })
        }
    }, function(err, results) {
        //console.log(results.news,results.newscate);

        res.render('admin/news/edit',{
            list:results.news,
            newscate:results.newscate,
        })
    });

})
router.post('/doEdit',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        //console.log(fields,files);
        var title =fields.title[0];
        var author =fields.author[0];
        var cid =fields.cid[0];
        var cidName=fields.catename[0]
        var keywords =fields.keywords[0];
        var discription =fields.discription[0];
        var content =fields.content[0];
        var pic=files.pic[0].path;
        var id=fields.id[0];
        if(files.pic[0].originalFilename==''){
            var json={
                'title':title,
                'author':author,
                'cid':cid,
                'cidName':cidName,
                'keywords':keywords,
                'discription':discription,
                'content':content,
            }
        }else{
            var json={
                'title':title,
                'author':author,
                'cid':cid,
                'cidName':cidName,
                'keywords':keywords,
                'discription':discription,
                'content':content,
                'pic':pic,
            }
        }
        DB.update('news', {'_id':new DB.ObjectId(id)},json,function (err) {
            if(!err){
                res.redirect('/admin/news/')
            }
        })
    })

})

//删除新闻：
router.get('/delate',function(req,res){
    async.parallel({
        news: function(callback) {
            var id=req.query.id;
            DB.find('news',{'_id':new DB.ObjectId(id)},function(docs){
                callback(null,docs[0])
            })
        },
        newscate: function(callback) {
            DB.find('newscate',{},function(docs){
                callback(null,docs)
            })
        }
    }, function(err, results) {
        //console.log(results);
        res.render('admin/news/delate',{
            list:results.news,
            newscate:results.newscate,
        })
    });

})
router.post('/doDelate',function(req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        var id=fields.id[0];
        DB.remove('news', {'_id':new DB.ObjectId(id)},function (err) {
            if(!err){
                res.redirect('/admin/news/')
            }
        })
    })
})
router.post('/upload',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'static/upload';
    form.parse(req, function (err, fields, files) {
        var path=files.filedata[0].path;
        res.json({"err":"","msg":'/'+path});
    })
})
module.exports = router;


