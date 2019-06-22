'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 8000;
const configs = require('./config');

const config = {
  channelSecret: configs.lineapi.channelSecret,
  channelAccessToken: configs.lineapi.channelAccessToken
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);

  //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
  if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
    res.send('Hello LINE BOT!(POST)');
    console.log('疎通確認用');
    return;
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let replyText = '';
  if (event.message.text.includes("煽る") || event.message.text.includes("煽って") || event.message.text.includes("煽ってください") || event.message.text.includes("罵倒") || event.message.text.includes("罵倒して") || event.message.text.includes("煽り") || event.message.text.includes("死ね")) {

    const words = [
      '生きている価値あるー？',
      'お前ミチコオンラインやってないのー？？？',
      'この烏龍茶が!!',
      'このお話つまんなーい',
      'どこが悪いのぉ？あたまぁ？',
      'がきかよ',
      'ちょっと何言ってんかわかんなーい',
      '本当は謝りたくないけどごめんなさい',
      'わぁ変態さんだぁ',
      '日本語で話してくださぁい',
      '勝手にやっててくださぁーい',
      '全部おめーが悪いんです',
      'どうしてそんなにおバカさんなのぉ？',
      'おまわりさん！この人です！',
      '私テスト90点なんだけど...全然取れなくてやばーい',
      '頼むからオツムかオムツのどっちかは装備してよー',
      '不思議なことに申し訳ないという気持ちが一ミリも湧いてこない...',
      '大人ならしっかりしてよー',
    ];
    replyText = words[Math.floor(Math.random() * words.length)];

  } else if (event.message.text == 'ヘルプ' || event.message.text == 'help') {

    replyText = 'なに友だち気取りになってるの？やめてほしいんだけど...私の通知を表示して欲しくないので、この画面上の[V]メニューにある[通知オフ]ボタンをタップしろ!!\n「煽る」「煽り」「煽って」「罵倒」「罵倒して」などと発言したらしょうがないから煽ってあげるわ';

  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyText
  });

}

// app.listen(PORT);
(process.env.NOW_REGION) ? module.exports = app: app.listen(PORT);
console.log(`Server running at ${PORT}`);