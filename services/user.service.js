const db = require("./../models");
const User = db.user;
const jwt = require('../providers/jwt')
const bcrypt = require("bcrypt");
module.exports = {

    login(req, res) {
        User.findOne({
            where: {
                login: req.body.login
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                var passwordIsValid = bcrypt.compare(
                    req.body.password,
                    user.password
                );
                if (!passwordIsValid) {
                    return res.status(401).send({
                        token: null,
                        message: "Invalid Password!"
                    });
                }
                User.findOne({ where: { id: user.id } }, (err, user) => {
                    if (err) { }
                    const payload = { key: user.key, password: user.password, login: user.login }
                    const result = jwt.sign(payload);
                    return res.send(result);
                })
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    },
    async register(req, res) {
        const saltRounds = 10;
        const { sousAgenceCode, key, password, login } = req.body;
        const hashedPwd = await bcrypt.hash(password, saltRounds);
        User.create({
            login: login,
            password: hashedPwd,
            sousAgenceCode: sousAgenceCode,
            key: key,
        })
            .then(User => {
                res.status(201).json(User);
            })
            .catch(error => {
                res.status(500).json(error)
            });
    },

    getAllUser(req, res) {
        User.findAll()
            .then(User => {
                res.status(200).json(User)
            })
            .catch(error => {
                res.status(500).json(error)
            });
    },

    getUserById(req, res) {
        const idUser = req.params.id;
        User.findOne({ where: { id: idUser } })
            .then(User => {
                res.status(200).json(User)
            })
            .catch(error => {
                res.status(500).json(error)
            });
    },

    updateUser(req, res) {
        const idUser = req.params.id;
        User.update(req.body, { where: { id: idUser } })
            .then(User => {
                res.status(201).json(User);
            })
            .catch(error => {
                res.status(500).json(error)
            });
    },

    deleteUser(req, res) {
        const idUser = req.params.id;
        User.destroy({ where: { id: idUser } })
            .then(() => {
                res.status(200).json({ status: 'success', message: 'User supprimé' })
            })
            .catch(err => { res.status(500).json({ status: 'error', message: JSON.stringify(err) }) });

    }
}

