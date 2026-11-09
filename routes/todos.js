const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. 할 일 목록 조회
router.get('/', async (req, res) => {
    try {
        const [todos] = await db.query(
            `SELECT id, title, is_done,
                    DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date
             FROM todos
             ORDER BY id DESC`
        );

        res.render('todos', {
    todos,
    filter: '전체'
});
    } catch (err) {
        console.error(err);
        res.status(500).send('목록 조회 오류');
    }
});

// 2. 할 일 등록
router.post('/', async (req, res) => {
    try {
        const { title, due_date } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).send('할 일을 입력하세요.');
        }

        await db.query(
            'INSERT INTO todos (title, due_date) VALUES (?, ?)',
            [title.trim(), due_date || null]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('등록 오류');
    }
});

// 3. 할 일 수정 화면
router.get('/:id/edit', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, title,
                    DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date
             FROM todos WHERE id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).send('할 일을 찾을 수 없습니다.');
        }

        res.render('edit', { todo: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('수정 화면 오류');
    }
});

// 4. 할 일 수정 처리
router.post('/:id/edit', async (req, res) => {
    try {
        const { title, due_date } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).send('할 일을 입력하세요.');
        }

        await db.query(
            'UPDATE todos SET title = ?, due_date = ? WHERE id = ?',
            [title.trim(), due_date || null, req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('수정 오류');
    }
});

// 5. 완료 상태 변경
router.post('/:id/toggle', async (req, res) => {
    try {
        await db.query(
            'UPDATE todos SET is_done = NOT is_done WHERE id = ?',
            [req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('상태 변경 오류');
    }
});

// 6. 할 일 삭제
router.post('/:id/delete', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM todos WHERE id = ?',
            [req.params.id]
        );

        res.redirect('/todos');
    } catch (err) {
        console.error(err);
        res.status(500).send('삭제 오류');
    }
});

module.exports = router;
