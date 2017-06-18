
/**
 * Module dependencies. 模块依赖
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoStore = require('connect-mongo')(express);
var setting = require('./setting');
var flash = require('connect-flash');

var app = express();

// all environments
//设置端口
app.set('port', process.env.PORT || 3000);

//设置views文件夹为存放视图文件的目录
app.set('views', path.join(__dirname, 'views')); 

//设置视图模板引擎为EJS
app.set('view engine', 'ejs');

app.use(flash());

//connect内建的中间件，使用默认的favicon图标
app.use(express.favicon());

//使用自己的图标
// app.use(express.favicon(__dirname + /public/images/favicon.ico));

//connect内建的中间件，在开发环境下使用，在终端显示简单的日志
app.use(express.logger('dev'));


//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.bodyParser());

//connect内建的中间件，协助处理POST请求，伪装PUT,DELETE和其他HTTP方法
app.use(express.methodOverride());

app.use(express.cookieParser);
app.use(express.session({
  secret:setting.cookieSecret,      //防止篡改cookie
  key:setting.db,                   //cookie的名字
  cookie:{maxAge:1000*60*60*24*30}, //设置cookie的生存周期为30天
  store:new mongoStore({db:setting.db})
}));


//调用路由解析规则
app.use(app.router);

//connect内建的中间件，将根目录下的public文件夹设置为存放image/css/js等静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

// development only 配置开发环境下的错误处理，输出错误信息
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//路由设置
//app.get('/', routes.index);
//调用ejs模板引擎来渲染index.js模板文件，生成静态文件并显示在浏览器中 
// app.get('/',function(req,res){
//   res.render('index',{title:'Express'});
// })
routes(app);

app.get('/hello',function(req,res){
  res.send('Hello world!');
});

//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
