import fs from "fs";
import http from "http";

// import { USERS } from "./users.mjs";
const USERS = { // 登録済みユーザー
  "** ipv6 address **": { "name": "だれか" },
  "::1": {　"name": "ろーかる"　},
};

const server = http.createServer();
server.listen(8060, "::", function () {
  console.log("listener");
});

server.on("request", function (req, res) {
  if (req.url.indexOf(".png") >= 0) {
    fs.readFile("./" + req.url, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
    return;
  }
  const addr = req.connection.remoteAddress;
  const user = USERS[addr];
  console.log(addr, user);

  if (user) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<meta charset="utf-8">`);
    res.write(`ようこそ${user.name}さん！`);
    res.write(`<h2>鯖江市民メニュー</h2>`);
    res.write(`<button>結婚する</button>`);
    res.write(`<button>水道を止める</button>`);
    res.end();
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<meta charset="utf-8">`);
    res.write(`<h1>鯖江市民認証サービス</h1>`);
    res.write(`<img src=q.png height=100><br>`);
    res.write(`姓名：<input type=text><br>`);
    res.write(`住所：<input type=text><br>`);
    res.write(
      `<img src="https://chart.apis.google.com/chart?chs=140x140&cht=qr&chl=${addr}"><br>`,
    );
    res.write(`EverIP： <code>${addr}</code><br>`);
    res.write(`本EverIPとあなたを鯖江市民として登録するサービスへ申し込みます<br>`);
    res.write(`<div>署名：_______________________(印)</div>`);
    res.write(`<button onclick="window.print()">印刷する</button>`);
    res.end();
  }
});
