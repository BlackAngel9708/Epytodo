modulde.export = (req, res, next) => {
    var id = req.params.id;
    var db = require('../config/db');

    if (id) {
        db.execute('SELECT * FROM todos WHERE id = ?', [id], function(err, result, fields) {
            if (result.length > 0) {
                next();
            } else {
                res.status(404).json({"msg": "Not found"});
            }
        });
    } else {
        res.status(500).json({"msg": "Server Error"});
    }
}