import express from 'express';
import nunjucks from 'nunjucks';

const port = 8060;

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

const USERS = { // 登録済みユーザー
  "** ipv6 address **": { "name": "だれか" },
  "::1": {　"name": "ろーかる"　},
};

var checkEverIP = function (req, res, next) {
  const addr = req.connection.remoteAddress;
  res.locals.user = USERS[addr] || {};
  res.locals.user.ip = req.connection.remoteAddress;
  res.locals.user.exists = USERS[addr] ? true : false;
  next()
}

app.use(checkEverIP);

app.use(express.static('public'))

app.get('/', function(req, res) {
    if (res.locals.user.exists) {
      res.render('home.html');
    } else {
      res.render('signup.html');
    }
});

app.listen(port, () => {
  console.log(`DX Gov listening at http://[::1]:${port}`)
})
