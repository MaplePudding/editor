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
                res.json({ret_code: 0, ret_msg: 'success'})
            })
        }
    })

});

//注册
app.get('/signup', function(req, res){
    db.query(`select * from editor where name='${req.query.name}'`, (err, data) =>{
        let dataArr = JSON.parse(JSON.stringify(data))
        if(dataArr.length === 0){
            db.query(`insert into editor (name, password) values('${req.query.name}','${req.query.pwd}')`)
            res.json({ret_code: 0, ret_msg: 'success'})
        }else{
            res.json({ret_code: 2, ret_msg: 'error'})
        }
    })
})

// 退出登录
app.get('/logout', function(req, res, next){  

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