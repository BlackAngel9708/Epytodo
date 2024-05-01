var db = require ('../../config/db');
const jwt = require ('jsonwebtoken');

exports.all_user = function (res, id) {
    db.query ('SELECT * FROM users', function (err, result, fields) {
        res.status (200).json (result);
    });
}

exports.all_todo = function (res, id) {
    db.query ('SELECT * FROM todos WHERE user_id = ?', [id], function (err, result, fields) {
        res.status (200).json (result);
    });
}

exports.register = function (res, mail, pwd, mname, fname) {
    db.execute ('INSERT INTO `users` (mail, password, name, firstname) VALUES (?, ?, ?, ?)', [mail, pwd, mname, fname], function (err, result, fields) {
        const token = jwt.sign ({email:mail, password:pwd}, 'SECRET');
            res.status (200).json (result);
    })
}

exports.check_account_mname = function (res, mname, callback) {
    db.execute('SELECT * FROM users WHERE name = ?', [mname], function (err, result, fields) {
        if (result.length > 0) {
            callback (84);
        } else {
            callback (0);
        }
    });
}

exports.check_account_mail = function (res, mail, callback) {
    db.execute('SELECT * FROM users WHERE mail = ?', [mail], function (err, result, fields) {
        if (result.length > 0) {
            callback (84);
        } else {
            callback (0);
        }
    });
}

exports.get_mail_account = function (res, mail, pwd, bcrypt, callback) {
    db.execute('SELECT password, id FROM users WHERE mail = ?', [mail], function (err, result, fields) {
        if (result.length > 0) {
            var pwd2 = result[0].password;
            var id2 = result[0].id;
            if (bcrypt.compareSync (pwd, pwd2)) {
                const token = jwt.sign ({email:mail, id:id2}, 'SECRET');
                res.json({token});
                callback (0);
            } else {
                callback (84);
            }
        } else {
            callback (84);
        }
    })
}

exports.get_info_id_or_mail = function (res, data) {
    db.execute('SELECT * FROM users WHERE mail = ?', [data], function (err, result, fields) {
        if (result.length > 0) {
            res.status (200).json (result);
        } else {
            db.exectre('SELECT * FROM users WHERE id = ?', [data], function (err, result, fields) {
                res.status (200).json (result);
            });
        }
    });
}

exports.delete_user_by_id = function(res, id) {
    db.execute('DELETE FROM users WHERE id = ?', [id], function(err, result, fields) {
        res.status(200).json({"msg": "Successfully deleted record number : ${ id }"});
    });
}

exports.update_user_by_id = function(res, id, mail, pwd, mname, fname) {
    db.execute('UPDATE users SET mail = ?, password = ?, name = ?, firstname = ? WHERE id = ?', [mail, pwd, mname, fname, id], function(err, result, fields) {
        db.execute('SELECT id, email, password, created_at, firstname, name, FROM user WHERE id = ?', [id], function(err, result, fields) {
            res.status(200).json(result);
        });
    });
}