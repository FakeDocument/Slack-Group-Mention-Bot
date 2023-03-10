# Slack-Group-Mention-Bot

## What About これは何？

This bot is a simulated Slack group-mentioning bot.  
Slackのグループメンションを擬似的に再現するBotです  

## 動作確認済みの環境

Node.js v18.13.0  
typescript v4.9.5  
@slack/bolt v3.12.2

## 参考

<https://slack.dev/bolt/ja-jp/tutorial/getting-started>

## How To Use

このリポジトリをクローン

リポジトリで`npm install`を実行。必要な Module がインストールされる

## アプリの作成

[ここ](https://api.slack.com/apps?new_app=1)からアプリを新規作成
アイコン、名前、説明を設定する。

## SocketMode の有効化と AppToken の取得

アプリ管理画面の**Socket Mode**から`Enable Socket Mode`を ON にする。その再、Token の生成を求められるので適当な名前を付ける。`xapp-`から始まる AppToken が生成されるのでそれを確認しておく。これは**Basic Infomation**の App-Level Tokens でも確認することができる。

## サイン認証(Signing Secret)の取得

アプリ管理画面の**Basic Infomation**に移動する。そこの Signing Secret から`Signing Secret`を取得できる。

## BotToken の取得

### -Event Subscriptions の登録

**Event Subscriptions**で`Enable Events`を ON にする。その下の Subscribe to bot events で`Add Bot User Event`をクリックし`message.channels`を登録する。Privateチャンネルでメッセージに反応させるため`message.groups`も同様に登録する。

### -Scope の追加

**OAuth & Permissions**に移動し、Bot Token Scopes までスクロールしたら**Add an OAuth Scope**から

- `users:read`
- `chat:write`

の 2 つの Scope を追加する。また、`channels:history`が登録されているがこれは前項の Event Subscriptions で追加されたものである。

### -BotToken の取得

ページ上部の**Install App to Workspace**からワークスペースにアプリをインストールし、移動したページの、**OAuth & Permission**の**Bot User OAuth Access Token**から Token を確認できる。

## 環境変数の設定

前項で取得した App Token と Bot Token と Signing Secret をそれぞれ、
`SLACK_APP_TOKEN`
`SLACK_BOT_TOKEN`
`SLACK_BOT_SIGNING_SECRET`
という環境変数を作り、保存する。

## setting.jsonの編集  
`resouce/setting.json`を編集することでグループを設定することができる。  
```json
[
  {
    "groupName": "各グループの名称。他と被らないものにすること",
    "virtual_mention": ["反応させる","仮想の","@メンションキーワード","複数設定できる"],
    "include": ["他のグループのgroupNameを書くと","そこに含まれるメンバーもこのグループのメンバーとして扱われる"],
    "members": [
      "SlackのUserNameをかく",
      "表示名とも本名とも違うので注意"
    ]
  }
]
```

## 実行

`node ./build/App.js`を実行

⚡️ Bolt app is running!

と出力されれば成功。お疲れ様でした。  

## Future
多分includeで指定されたグループ名の順序によってはバグが起きる。例えば
```json
[
    {
        "groupName": "Hoge",
        "virtual_mention": ["hoge"],
        "include": ["Bar"],
        "members": ["Ms.hoge"]
    },
    {
        "groupName": "Foo",
        "virtual_mention": ["foo"],
        "include": [],
        "members": ["Dr.foo"]
    },
    {
        "groupName": "Bar",
        "virtual_mention": ["bar"],
        "include": ["Foo"],
        "members": ["Bar.Master"]
    }
]
```
この場合期待されるHogeのmembersは`["Ms.hoge","Dr.foo","Bar.Master"]`だが、処理順の関係で`["Ms.hoge","Bar.Master"]`になってしまう。まだBarのinclude処理が終わってないため。これをどうにかして直す。