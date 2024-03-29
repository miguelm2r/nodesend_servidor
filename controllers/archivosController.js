const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits : { fileSize: req.usuario ? 1024*1024*10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) =>{
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            }
        })
    }
    
    const upload = multer( configuracionMulter ).single('archivo')


    upload(req, res, async (error) => {
        console.log(req.file)

        if(!error){
            res.json({archivo: req.file.filename})
        } else {
            console.log(error)
            return next()
        }
    })
    
}

exports.eliminarArchivo = async (req, res, next) => {
    
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
    } catch (error) {
        console.log(error)
    }
}


// Descarga un archivo
exports.descargar = async (req, res, next) => {

    const { archivo } = req.params
    // Obtener el enlace
    const enlace = await Enlaces.findOne({nombre: archivo})

    const archivoDescarga = __dirname + '/../uploads/' + archivo
    res.download(archivoDescarga)

    // Eliminar el archivo y el enlace de la DB
    const { descargas, nombre } = enlace

    // Si las descargas son iguales a 1. Borrar entrada y borrar archivo
    if(descargas === 1){
        // Eliminar el archivo
        req.archivo = nombre
        // Eliminar la entrada de la base de datos
        await Enlaces.findOneAndRemove(enlace.id)
        next()
    } else {
        enlace.descargas--;
        await enlace.save()
    }
    // Si las descargas son mayores a 1. Restar 1
}