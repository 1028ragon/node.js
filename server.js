const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')


const { MongoClient } = require('mongodb');

let db
const url = 'mongodb+srv://1028ragon:npcs090909@1028ragon.oaooppv.mongodb.net/?retryWrites=true&w=majority&appName=1028ragon'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})
}).catch((err)=>{
  console.log(err)
})


app.get('/', (요청, 응답) => {
    응답.sendFile(__dirname + '/index.html')
}) // 유저에게 html 파일 보내주려면

app.get('/news', (요청, 응답) => {
    db.collection('post').insertOne({title : '어쩌구'})
    // 응답.send('오늘 비옴')
})

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  console.log(result[0]) // result.title 쓰면 '첫게시물'만 뜸
  // 응답.send(result[0].title)
  응답.render('list.ejs', { 글목록 : result }) // ejs파일로 데이터 보내는 법 (sendFile 아님)
})

app.get('/time', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  응답.render('time.ejs', { data : new Date() }) 
})


