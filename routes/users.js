const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//pagina de login
router.get('/login', function(req, res) {
    res.render('login');
});

//Pagina de registro
router.get('/register', function(req, res) {
    res.render('register');
});

//Pagina para darse de alta
router.post('/register', function(req, res) {
    const { name, email, password, password2 } = req.body; //extraer las variables
    let errors = [];
    //Comprobar que los campos estén completos
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Completa todos los campos!' });
    }

    //Revisar que las contraseñas coincidan
    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden' });
    }

    //Tamaño de la contraseña
    if (password.length < 8) {
        errors.push({ msg: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password
        });
    } else {
        //Validacion
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //Usuario existe
                    errors.push({ msg: 'El email ya está registrado' });
                    res.render('register', {
                        errors,
                        name,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //Encriptar contraseña
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Se asigna el hash a la contraseña
                            newUser.password = hash;
                            //Guardar usuario
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registrado exitosamente');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    }
});

//Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Has cerrado sesión');
    res.redirect('/users/login');
});

module.exports = router;