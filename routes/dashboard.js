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


//AGREGAR INVENTARIO
router.post('/addinv', ensureAuthenticated, function(req, res) {
    const { marca, compuesto, descripcion, cantidad } = req.body; //extrae variables
    let errors = [];

    if (!marca || !compuesto || !descripcion || !cantidad) {
        errors.push({ msg: 'Faltan campos' });
    }

    if (errors.length > 0) {
        res.render('agregarinv', {
            errors,
            marca,
            compuesto,
            descripcion,
            cantidad,
            name: req.user.name,
            email: req.user.email
        });
    } else {
        Tasks.findOne({ compuesto: compuesto })
            .then(compst => {
                if (compst) {
                    //ya existe el compuesto
                    errors.push({ msg: 'Ya está registrado ese compuesto' });
                    console.log(marca, descripcion, cantidad);
                    res.render('agregarinv', {
                        errors,
                        marca,
                        descripcion,
                        cantidad,
                        name: req.user.name,
                        email: req.user.email
                    });
                } else {
                    const newTask = new Tasks({
                        compuesto,
                        marca,
                        descripcion,
                        cantidad
                    });
                    newTask.save()
                        .then(task => {
                            req.flash('success_msg', 'Se agregó correctamente');
                            res.redirect('/dashboard/inventario');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});


//EDITAR INVENTARIO
router.get('/editar/:id', ensureAuthenticated, (req, res) =>
    Tasks.findById(req.params.id).then(data => {
        res.render('editar', {
            name: req.user.name,
            email: req.user.email,
            compuesto: data.compuesto,
            marca: data.marca,
            descripcion: data.descripcion,
            cantidad: data.cantidad,
            id: req.params.id
        })
    }));

//MODIFICAR INVENTARIO
router.post('/modify/:id', ensureAuthenticated, function(req, res) {
    const { marca, compuesto, descripcion, cantidad } = req.body;
    const id = req.params.id;
    console.log(id);
    let errors = [];
    if (!marca || !compuesto || !descripcion || !cantidad) {
        errors.push('Faltan campos');
    }
    if (errors.length > 0) {
        res.render('editar', {
            marca,
            compuesto,
            descripcion,
            cantidad,
            id
        });
    } else {
        Tasks.findByIdAndUpdate({ _id: id }, { marca: marca, compuesto: compuesto, descripcion: descripcion, cantidad: cantidad })
            .then(task => {
                req.flash('sucess_msg', 'Se agregó correctamente');
                res.redirect('/dashboard/inventario');
            }).catch(err => console.log(err));
    }
});

module.exports = router;