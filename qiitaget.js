const axios = require('axios');

//タグは16個(1人4人)
var tagsample = ["python","javascript","ruby","php","rails","ios","aws","android","java","swift","html","css","linux","github","vue.js","c"];

//qiitaAPI
const request_qiita = axios.create({
    baseURL: 'https://qiita.com/api/v2/'
});

//firestore初期設定
var admin = require('firebase-admin');
var serviceAccount = require(/*秘密鍵のパス*/);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: /*firestoreのURL*/
});
var db = admin.firestore();

//30分毎に実行。
setInterval(function(){
    get_sprint();
}, 1800000);

get_sprint();


//取得するスプリント
function get_sprint() {

    //ここのi の値は、配列のインデックスを返すため、各自で変更！
    for (let i = 0; i <4 ; i++) {

        //per_pageで取得記事変化
        request_qiita.get('tags/' + tagsample[i] + '/items?pages=1&per_page=50')
            .then(res => {
                var hash = res.data;
                //それぞれのタグの記事のいいね数を取得
                hash.forEach(function (art) {

                    var bool = false; //firestoreに含まれているかどうか確かめる。

                    //DBに入れる
                    var data = {
                        url: art["url"],
                        likes: art["likes_count"],
                        created_at: art["created_at"],
                        id: art["id"]
                    };

                    //console.log("data :" + data["id"]);
                    db.collection('articles').get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                // console.log(bool);
                                // console.log(doc.data().id);
                                if (doc.data().id === data["id"]) {//firestoreのデータと今とったデータが同じ
                                    const rateOfLikes = (data["likes"] + 1) / (doc.data().likes + 1);
                                    //console.log("yes");
                                    if (rateOfLikes > 2) {//いいね比が2を超えたらslackにスロー
                                        slack_throw(data["url"]);
                                    }
                                    //console.log("doc:" + doc.data().id);


                                    doc.ref.update({likes: data["likes"]})
                                        .catch(error => {
                                            console.log(error);
                                        });
                                    bool = true;
                                }
                            });
                            if (bool === false) {
                                //console.log("追加")
                                db.collection('articles').add(data);
                            }
                        });

                });

            }).catch(err => {
            console.log('err:', err);
        });
    }
}

//slackにスローするfunction
function slack_throw(text_slack) {

    const url = "/*slackのURL*/ ";

    axios.post(
        url,
        {
                username: 'qiita_trend',
                channel: '#qiita_throw',
                text: text_slack
         }
         ).then(response =>{
        console.log(response);
    }).catch(error =>{
        console.log(error.response);
    });

}
