const {register, check_account_mail, get_mail_account} = require('./../user/user.query');

module.exports = function(app, bcrypt) {
    app.post('/login', (req, res) => {
        var mail = req.body["mail"];

        if (mail === undefined || req.body["password"] === undefined) {
            res.status(500).json({"msg": "Internal server error"});
            return;
        }
        get_mail_account(res, mail, req.body["password"], bcrypt, function(nbr) {
            if (nbr == 84) {
                res.status(401).json({"msg": "Invalid Credentials"});
            }
            return;
        });
    });
    app.post('/register', (req, res) => {
        var mail = req.body["mail"];
        var mname = req.body["name"];
        var fname = req.body["firstname"];
        var pwd = req.body["password"];

        if (mail === undefined || mname === undefined || fname === undefined || pwd === undefined) {
            res.status(500).json({"msg": "Internal server error"});
            return;
        }
        pwd = bcrypt.hashSync(pwd, 10);
        check_account_mail(res, mail, function (nbr) {
            if (nbr == 84) {
                res.status(409).json({"msg": " Account already exists"});
                return;
            } else {
                register(res, mail, pwd, mname, fname);
                return;
            }
        });
    });
}