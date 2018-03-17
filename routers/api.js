express = require('express');
var router = express.Router();
var DB=require('./../module/db.js');

router.get('/news',function(req,res){
    var cid=req.query.id;
    DB.find('news',{"cid":cid},function(docs){
        res.jsonp({
            result:docs
        })
    })
})


module.exports = router;





//DB.find('user',{},function(data){
//    res.jsonp({   /*支持ajax 和jsonp*/
//        result:data
//    })
//})
