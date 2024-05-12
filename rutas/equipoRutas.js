const express = require('express');
const rutas = express.Router();
const EquipoModel = require('../models/Equipo');

//endpoint traer todas las equipos
rutas.get('/getEquipos', async (req, res) => {
    try  {
        const equipo = await  EquipoModel.find();
        res.json(equipo);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//endpoint 2. Crear
rutas.post('/crear', async (req, res) => {
    const equipo = new EquipoModel({
        EQUIPO: req.body.EQUIPO,
        ESTADO_INICIAL: req.body.ESTADO_INICIAL,
        MARCA: req.body.MARCA,
        MODELO: req.body.MODELO,
        IMEI_SERIE: req.body.IMEI_SERIE,
        ACTIVO: req.body.ACTIVO,
        LINEA: req.body.LINEA,
        GMAIL: req.body.GMAIL,
        ESTADO_FINAL: req.body.ESTADO_FINAL,
        FECHA_REG: req.body.FECHA_REG,
        FECHA_ESTADO_FINAL: req.body.FECHA_ESTADO_FINAL,
    })
    try {
        const nuevoEquipo = await equipo.save();
        res.status(201).json(nuevoEquipo);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3. Editar
rutas.put('/editar/:id', async (req, res) => {
    try {
        const equipoEditado = await EquipoModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        if (!equipoEditado)
            return res.status(404).json({ mensaje : 'Receta no encontrada!!!'});
        else
            return res.json(equipoEditado);

    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
})
//ENDPOINT 4. eliminar
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const equipoEliminado = await EquipoModel.findByIdAndDelete(req.params.id);
       if (!equipoEliminado)
            return res.status(404).json({ mensaje : 'Equpo no encontrado!!!'});
       else 
            return res.json({mensaje :  'Equipo eliminado'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//end
module.exports = rutas;
