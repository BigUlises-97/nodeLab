const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');

//Inventarios
const Tasks = require('../models/Tasks');

//User model
const User = require('../models/User');

//Prestamos
//const Presta = require('../models/Presta');

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

    console.log(id, marca, compuesto, descripcion, cantidad);

    let errors = [];

    if (!marca || !compuesto || !descripcion || !cantidad) {
        errors.push('Faltan campos');
    }
    console.log(errors);
    if (errors.length > 0) {
        res.render('editar', {
            errors,
            marca,
            compuesto,
            descripcion,
            cantidad,
            id,
            name: req.user.name,
            email: req.user.email
        });
    } else {
        Tasks.findByIdAndUpdate({ _id: id }, { marca: marca, compuesto: compuesto, descripcion: descripcion, cantidad: cantidad, fecha: Date.now() })
            .then(task => {
                req.flash('sucess_msg', 'Se agregó correctamente');
                res.redirect('/dashboard/inventario');
            }).catch(err => console.log(err));
    }
});

//Eliminar
router.get('/delete/:id', ensureAuthenticated, function(req, res) {

    Tasks.findByIdAndDelete({ _id: req.params.id }).then(task => {
        res.redirect('/dashboard/inventario');
    }).catch(err => console.log(err));
});
/*
//-------PRESTAMOS---------
router.get('/prestamos', ensureAuthenticated, (req, res) =>
    res.render('prestamos', {
        name: req.user.name,
        email: req.user.email
    }));

*/


//----CUENTA----
router.get('/cuenta', ensureAuthenticated, (req, res) =>
    res.render('cuenta', {
        name: req.user.name,
        email: req.user.email
    }));

router.get('/mcuenta', ensureAuthenticated, function(req, res) {

    User.findOne({ email: req.user.email }).then(user => {
        if (user) {
            const id = user._id;

            console.log(id);

            res.render('mcuenta', {
                name: req.user.name,
                email: req.user.email,
                id: id
            })
        }
    });
});

router.post('/upcuenta/:id', ensureAuthenticated, function(req, res) {
    const { name, email, password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Completa los campos' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no son iguales' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'La contraseña debe tener al menos 8 caracteres' });
    }

    if (errors.length > 0) {
        res.render('mcuenta', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        const tempUser = new User({
            name,
            email,
            password
        })
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(tempUser.password, salt, (err, hash) => {
                if (err) throw err;
                tempUser.password = hash;
                //console.log(tempUser.password);
                User.findByIdAndUpdate({ _id: id }, { name: tempUser.name, email: tempUser.email, password: tempUser.password })
                    .then(data => {
                        req.flash('success_msg', 'Datos actualizados!');
                        res.redirect('/dashboard/cuenta');
                    })
                    .catch(err => console.log(err));
            }));
    }
});


module.exports = router;