// /todos 라우터 — CRUD 전체
const express = require("express");
const pool = require("../db");
const router = express.Router();

// [R] 목록 조회 (+ 실습 5: 완료/미완료 필터)
// /todos            → 전체
// /todos?filter=active → 미완료만
// /todos?filter=done   → 완료만
router.get("/", async (req, res, next) => {
  try {
    const filter = req.query.filter || "all";

    let sql = "SELECT * FROM todos";
    if (filter === "active") sql += " WHERE done = FALSE";
    if (filter === "done") sql += " WHERE done = TRUE";
    sql += " ORDER BY due_date IS NULL, due_date, created_at DESC";

    const [todos] = await pool.query(sql);
    res.render("todos", { todos, filter });
  } catch (err) {
    next(err);
  }
});

// [C] 등록: 폼 POST → INSERT → 목록으로 redirect (실습 2)
router.post("/", async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    const dueDate = req.body.due_date || null; // 빈 값이면 NULL

    if (title === "") return res.redirect("/todos");

    await pool.query("INSERT INTO todos (title, due_date) VALUES (?, ?)", [
      title,
      dueDate,
    ]);
    res.redirect("/todos"); // 새로고침해도 중복 등록 안 되도록 redirect
  } catch (err) {
    next(err);
  }
});

// [U] 완료/미완료 토글 (실습 3)
router.post("/:id/toggle", async (req, res, next) => {
  try {
    await pool.query("UPDATE todos SET done = NOT done WHERE id = ?", [
      req.params.id,
    ]);
    res.redirect("/todos");
  } catch (err) {
    next(err);
  }
});

// [U] 수정 폼 보여주기 (실습 3)
router.get("/:id/edit", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM todos WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.redirect("/todos");
    res.render("edit", { todo: rows[0] });
  } catch (err) {
    next(err);
  }
});

// [U] 제목·마감일 수정 (실습 3)
router.post("/:id/edit", async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    const dueDate = req.body.due_date || null;
    if (title !== "") {
      await pool.query(
        "UPDATE todos SET title = ?, due_date = ? WHERE id = ?",
        [title, dueDate, req.params.id]
      );
    }
    res.redirect("/todos");
  } catch (err) {
    next(err);
  }
});

// [D] 삭제 (실습 4)
router.post("/:id/delete", async (req, res, next) => {
  try {
    await pool.query("DELETE FROM todos WHERE id = ?", [req.params.id]);
    res.redirect("/todos");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
