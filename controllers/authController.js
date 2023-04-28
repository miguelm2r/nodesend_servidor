const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("../models/Usuario")
const { validationResult } = require('express-validator');
require('dotenv').config({path: 'variables.env'})


exports.autenticarUsuario = async(req, res, next) => {
    // Revisar si hay errores
    const errores = validationResult(req)
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    // Buscar el usuario para ver si esta registrado
    const { email, password } = req.body
    const usuario = await Usuario.findOne({ email})

    if(!usuario){
        res.status(401).json({msg: "El usuario no existe"})
        return next()
    }

    // Verificar password y autenticar usuario
    if(bcrypt.compareSync(password, usuario.password)){
        // Crear json web token
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA, {
            expiresIn: '8h'
        });

        res.json({token})

    } else {
        res.status(401).json({msg: "El password es incorrecto"})
        return next()
    }

}

exports.usuarioAutenticado = async(req, res, next) => {
    
    res.json({usuario: req.usuario})
}