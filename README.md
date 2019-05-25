### 概要
qiitaのタグ16個のそれぞれの記事を30分毎に更新し、
いいねの数によってslack(#qiita_throw)にスロー。

### 環境
node.jsでaxiosを用いる。

### 方針
新しくとったデータのいいね数が
firestoreのいいね数の2倍を超えていれば、
slackにスロー

### 個々人で変えてほしい所
- firestoreの秘密鍵
- firestoreのdataURL
- slackのincoming webhookのパスワード設定
- タグ16個を4人で回すために、for文の中身のindexを変化
(わき…0～3,うっち…4～7,すだめ…8～11,Prof…12～15)


