const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

router.get('/', (req, res) => {
    if (req.session && req.session.name) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', (req, res) => {
    const { name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(process.env.HASHED_PASSWORD, 10);
        if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.name = name;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});
module.exports = router;