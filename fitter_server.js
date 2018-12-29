var http = require('http');
var Params=require("./Tools/Params");
var url=require("url");
var User=require("./DAO/User");
var fs=require("fs");

http.createServer(function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Content-type", "text/html;charset=utf-8");
    var param=url.parse(req.url,true);


    var strQuery=param.pathname;
   // console.log(strQuery);

    if(strQuery=="/register"){
        //注册
        Params.postData(req,function(param){
            var rtn={};
            User.register(param,function (err,rows) {

                if(err||rows.affectedRows==0){
                    rtn={
                        state:"err"
                    }
                }
                else{
                    rtn={
                        state:"OK"
                    }
                }
                var regState=JSON.stringify(rtn);
                res.end(regState);
            });
        });
    }else if(strQuery == "/login"){
        //登陆
        Params.postData(req,function(param){
            var rtn = {};
            User.login(param,function (err,rows) {
                if(err||rows.length==0){
                    rtn={
                        state:"err"
                    }
                }else{
                    rtn={
                        Uid:rows[0].Uid,
                        UserName:rows[0].UserName,
                        Password:rows[0].Password,
                        state:"ok"
                    }
                }
                var regState=JSON.stringify(rtn);
                res.end(regState);
            });
        });
    }else if(strQuery == '/upimg'){
        //上传头像
        User.upHeadimg(req,res);
        
    }else if(strQuery == '/upInfo'){
        console.log(strQuery);
        //修改信息
        Params.postData(req,function(param){
            var rtn={};
            User.modifyInfo(param,function (err,rows) {

                if(err||rows.affectedRows==0){
                    rtn={
                        state:"err"
                    }
                }
                else{
                    rtn={
                        state:"OK"
                    }
                }
                var regState=JSON.stringify(rtn);
                res.end(regState);
            });
        });
    }else if(strQuery == "/infoLoad") {
        //加载个人资料
        Params.postData(req,function(param){
            var rtn={};
            User.infoLoad(param,function (err,rows) {
                var headimg = "http://192.168.1.103:3000/"+rows[0].Headimg;
                if(err||rows.affectedRows==0){
                    rtn={
                        state:"err"
                    }
                }
                else{
                    rtn={
                        UserName:rows[0].UserName,
                        Gender:rows[0].Gender,
                        telephone:rows[0].telephone,
                        Headimg:headimg,
                        Signature:rows[0].Signature,
                        Age:rows[0].Age,
                        City:rows[0].City,
                        
                        state:"OK"
                    }
                }
                var regState=JSON.stringify(rtn);
                res.end(regState);
            });
        });
    }else if(strQuery == "/uploader"){
        console.log(12)
    }else if(strQuery.startsWith("/src/img")){
		var currpath=__dirname;
		
		fs.readFile(currpath+strQuery,function(err,data){
			if(!err){
				res.end(data);
			}else{
				res.setHeader("content-Type","text/html;charset=UTF-8");
				res.end("没有可显示的图片");
			}
		});
	}


}).listen(3000);
