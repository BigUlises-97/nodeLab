const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

//Tasks
const Tasks = require('../models/Tasks');

//Inicio
router.get('/dashboard', ensureAuthenticated, (req, res) =>

    res.render('dashboard', {
        name: req.user.name,
        email: req.user.email
    }));

//Inventario
router.get('/inventario', ensureAuthenticated, (req, res) =>
    Tasks.find({}, function(err, data) {
        if (err) throw err;
        res.render('inventario', {
            name: req.user.name,
            email: req.user.email,
            data: data
        })
        console.log(data);
    }));

//Agregar inventario
router.get('/agregarinv', ensureAuthenticated, (req, res) =>
    res.render('agregarinv', {
        name: req.user.name,
        email: req.user.email
    }));

//Prestamos
router.get('/prestamos', ensureAuthenticated, (req, res) =>
    res.render('prestamos', {
        name: req.user.name,
        email: req.user.email
    }));

//Cuenta
router.get('/cuenta', ensureAuthenticated, (req, res) =>
    res.render('cuenta', {
        name: req.user.name,
        email: req.user.email
    }));

/*
router.post('/addinv', ensureAuthenticated, (req, res) => {
    model.find({}, (req, tasks) => {
        if (err) throw err;
        res.render('/inventario', {
            name: req.user.name,
            email: req.user.email,
            task: tasks
        });
    });
});
*/
module.exports = router;