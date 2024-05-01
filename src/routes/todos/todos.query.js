var db = require('../../config/db');

exports.all_todo = function(res) {
    db.query('SELECT * FROM todos', function(err, result, fields) {
        res.status(200).json(result);
    });
}

exports.todo_id = function(res, id) {
    db.query('SELECT * FROM todos WHERE id = ?', [id], function(err, result, fields) {
        res.status(200).json(result);
    });
}

exports.create_todo = function(res, title, description, duetime, id, status) {
    db.execute('INSERT INTO `todos` (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)', [title, description, duetime, status, id], function(err, result, fields) {
        var id_task = result["insertId"];
        db.execute('SELECT * FROM todos WHERE id = ?', [id_task], function(err, result, fields) {
            res.status(200).json(result);
        });
    });
}

exports.delete_task_by_id = function(res, id) {
    db.execute('DELETE FROM todos WHERE id = ?', [id], function(err, result, fields) {
        res.status(200).json({"msg": "Task deleted"});
    });
}

exports.update_task_by_id = function(res, id, title, desc, due_time, user_id, status) {
    db.execute('UPDATE todos SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?', [title, desc, due_time, user_id, status, id], function(err, result, fields) {
        db.execute('SELECT id, title, description, created_at, due_time, user_id, status FROM todos WHERE id = ?', [id], function(err, result, fields) {
            res.status(200).json(result);
        });
    });
}