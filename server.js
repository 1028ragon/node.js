const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb');

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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
  let result = await db.collection('post').find().toArray() // MongoDB의 post 컬렉션에서 모든 문서를 찾아 배열(result)로 변환합니다.
  // console.log(result[0]) // 콘솔창에 띄우는거임, result.title 쓰면 '첫게시물'만 뜸
  // 응답.send(result[0].title)
  응답.render('list.ejs', { 글목록 : result }) // ejs파일로 데이터 보내는 법 (sendFile 아님)
})

app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
})

app.post('/add', async (요청, 응답) => {
    console.log(요청.body)

    if (요청.body.title == '') {
    응답.send('제목입력안했는데?')
    } else { 
      await db.collection('post').insertOne({title : 요청.body.title, content : 요청.body.content}) // DB에 데이터 저장하려면 insertOne
      응답.redirect('/list')
    }

// 에러상황 처리
    try {  
      if (요청.body.title == '') {
    응답.send('제목입력안했는데?')
      } else { 
      await db.collection('post').insertOne({title : 요청.body.title, content : 요청.body.content})
      응답.redirect('/list')
      }
    } catch(e) {
      응답.status(500).send('서버에러남 ㅈㅅ')
    }
})

app.get('/detail/:id', async (요청, 응답) => {
  let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
    console.log(요청.params)
    응답.render('detail.ejs', { result : result })
})