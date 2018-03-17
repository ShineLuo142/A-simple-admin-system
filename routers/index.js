var express = require('express');
var router = express.Router();
var DB=require('./../module/db.js');
var multiparty = require('multiparty')
var async=require('async')

//index轮播图加载：
router.get('/',function(req,res){
    async.parallel({
        focus:function(cb){
            DB.find('focus',{'status':'0'},function(focusDate){
                cb(null,focusDate)
            })
        },
        news:function(cb){
            DB.find('news',{},function(newsDate){
                cb(null,newsDate)
            })
        },
        newscate:function(cb){
            DB.find('newscate',{'status':'0'},function(newscateDate){
                cb(null,newscateDate)
            })
        }
    },function(err,result){
        //console.log(result)
        res.render('index/index',{
            list:result.focus,
            newslist:result.news,
            catelist:result.newscate
        })
    })

})




//新闻列表：
router.get('/news',function(req,res){
    DB.find('newscate',{"status":"0"},function(newscateData){
        //console.log(req.query.id)
        if(req.query.id){
            var cid=req.query.id;
            var json={cid:cid};
        }else{
            var json={}
        }
        //console.log(json)
        DB.find("news",json,function(newsData){
            //console.log(newsData)
            res.render('index/news',{
                newscate:newscateData,
                list:newsData
            })
        })
    })

})
//新闻详情：
router.get('/newsdetail',function(req,res){
    var id=req.query.id;
    DB.find('news',{"_id":new DB.ObjectId(id)},function(docs){
        res.render('index/newsdetail',{
            list:docs[0]
        })
    })
})
module.exports = router;


