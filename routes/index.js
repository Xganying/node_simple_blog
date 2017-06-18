
/*
 * GET home page.
 */

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

var crypto = require('crypto');
User = require('../models/user.js');

module.exports = function(app){
  app.get('/', function(req,res){
    res.render('index',{
      title:'主页',
      user:req.session.user,
      success:req.flash('success').toString(), //将成功的信息赋值给变量success
      error:req.flash('error').toString()      //将错误的信息赋值给变量error
    });
  });
  app.get('/reg', function(req,res){
    res.render('reg',{
      title:'注册',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
  app.post('/reg',function(req,res){
    var name = req.body.name;
    var password = req.body.password;
    var password_re = req.body['password_repeat'];
    //检验用户两次输入的密码是否一致
    if(password_re != password){
      req.flash('error', '两次密码输入不一致！');
      return res.redirect('/reg');
    }
    //生成密码的MD5值
    var md5 = crypto.createHash('md5');
    password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name:req.body.name,
      password:password,
      email:req.body.email
    });
    //检查用户是否已经存在
    User.get(newUser.name, function(err,user){
      if(user){
        req.flash('error',"用户已存在!");
        return res.redirect('/reg'); //返回注册页面
      }
      //如果不存在则新增用户
      newUser.save(function(err,user){
        if(err){
          req.flash('error',err);
          return res.redirect('/reg');
        }
        req.session.user = user; //用户信息存入session
        req.flash('success', '注册成功!');
        res.redirect('/'); //注册成功之后返回主页
      });
    });
  });
  app.get('/login', function(req,res){
    res.render('login',{title:'登录'});
  });

  //登录响应
  app.post('/login',function(req,res){
    //生成密码的MD5值
    var md5 = crypto.createHash('md5'),password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function(err,user){
       if(!user){
          req.flash('error',"用户不存在!");
          return res.redirect('/login'); //返回注册页面
        }
        //检查密码是否一致
        if(user.password != password){
          req.flash('error', '密码错误！');
          return res.render('/login');
        }
        //用户名密码都匹配后，将用户信息存入session
        req.session.user = user;
        req.flash('success', '登录成功！');
        res.redirect('/');
    });
  });

  app.get('/post', function(req,res){
    res.render('post',{title:'发表'});
  });
  app.post('/post',function(req,res){

  });

  //退出登录响应
  app.get('/logout', function(req,res){
    req.session.user = null;
    req.flash('success', '登录成功！');
    req.redirect('/');
  });

}