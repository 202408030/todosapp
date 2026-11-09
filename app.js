// 실습 1: 앱 시작점 — 미들웨어와 라우터를 등록만 한다
// 실행: node app.js → http://localhost:3000/todos

const express = require("express");
const path = require("path");
const todosRouter = require("./routes/todos"); // 라우터 분리

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // 폼 데이터 처리
app.use(express.static(path.join(__dirname, "public"))); // 정적 파일

app.get("/", (req, res) => res.redirect("/todos"));

// /todos로 시작하는 요청은 모두 routes/todos.js가 처리
app.use("/todos", todosRouter);

// 에러 처리 기초: 라우트에서 next(err)가 호출되면 여기로 온다
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("서버 오류가 발생했습니다: " + err.message);
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}/todos`);
});
