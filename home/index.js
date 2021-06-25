const express = require('express');
const session = require('express-session');
const app = express();
const key = 'mapleKey';

//配置session

app.use(session({
    name: key,
    secret: 'maple',  
    saveUninitialized: false,  
    resave: false,  
    cookie: {
        maxAge: 10 * 1000  
    }
}));

//access-control-allow-origin

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



// 登录
app.get('/login', function(req, res, next){

    if(req.session.loginUser === req.query.name){
        return console.log("has been login")
    }
    
    var sess = req.session;
    var user = req.query.name === "maple" ? true : false

    if(user){

        req.session.regenerate(function(err) {
            if(err){
                return res.json({ret_code: 2, ret_msg: '登录失败'});                
            }
            
            req.session.loginUser = req.query.name;
            res.json({ret_code: 0, ret_msg: '登录成功'});                           
        });
    }else{
        res.json({ret_code: 1, ret_msg: '账号或密码错误'});
    }   
});

// 退出登录
app.get('/logout', function(req, res, next){
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug    

    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }
        
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        res.redirect('/');
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
}
)