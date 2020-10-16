"use strict";

import express from 'express';
import nunjucks from 'nunjucks';

const port = 8060;

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

interface User {
  name: string;
  age: number;
}

// 登録済みユーザー
const USERS: Record<string, User> = {
  "fc01:97ba:7e39:98c1:329b:ed85:db75:6fd6": { name: "福野", age: 41 },
  "::1": { name: "手寿戸", age: 100 },
};

export const checkEverIP = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.connection.remoteAddress != null) {
    if (USERS[req.connection.remoteAddress]) {
      res.locals.user = USERS[req.connection.remoteAddress];
      res.locals.user.exists = true;
    } else {
      res.locals.user = {};
      res.locals.user.exists = false;
    }
    res.locals.user.ip = req.connection.remoteAddress;
  } else {
    res.locals.user = {};
    res.locals.user.exists = false;
  }
  console.log( res.locals.user );
  next()
};

app.use(checkEverIP);

app.use(express.static('public'))

app.get('/', function(req, res) {
  if (res.locals.user.exists) {
    res.render('home.html');
  } else {
    res.render('signup.html');
  }
});
app.get('/register_terminal.html', function(req, res) {
  if (res.locals.user.exists) {
    res.render('register_terminal.html');
  } else {
    res.render('signup.html');
  }
});

app.listen(port, () => {
  console.log(`DX Gov listening at http://[::1]:${port}`)
})
