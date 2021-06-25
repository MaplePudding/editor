const express = require('express');
const session = require('express-session');
const mysql = require('mysql')
const app = express();
const key = 'mapleKey';

//连接mysql
const db = mysql.createConnection({
    host: 'localhost', user: 'root',
    password: '123456', database: 'editor'
});


db.query("select * from editor", (err, data) => {
    if (err) {
        console.log("error!", err);
    } else {
        console.log("success!", data)
    }
});

//配置session

app.use(session({
    name: key,
    secret: 'maple',  
    saveUninitialized: false,  
    resave: false,  
    cookie: {
        maxAge: 3600 * 14 * 1000
    }
}));

//access-control-allow-origin

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    //跨域
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});



// 登录
app.get('/login', function(req, res){
    // cookie session自动登录
    console.log(req.session.login)

    if(req.session.login){
        res.json({ret_code: 0, ret_msg: 'success'})
        return;
    }



    db.query(`select * from editor where name='${req.query.name}' and password='${req.query.pwd}'`, (err, data) =>{
        let dataArr = JSON.parse(JSON.stringify(data))
        if(dataArr.length === 0){
            res.json({ret_code: 2, ret_msg: 'error'})
        }else{
            req.session.regenerate(function(err){
                req.session.login = true
                console.log(req.session.login)
                res.json({ret_code: 0, ret_msg: 'success'})
            })
        }
    })

    
    /**
     *     var sess = req.session;
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
     */
});

app.get('/signup', function(req, res){

})

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

app.listen(8080, function () {
    console.log('Example app listening on port 3000');
}
)