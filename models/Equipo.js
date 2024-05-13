const mongoose = require('mongoose');
//definir el esquema
const EquipoSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    EQUIPO: String,
    ESTADO_INICIAL: String,
    MARCA: String,
    MODELO: String,
    IMEI_SERIE: String,
    ACTIVO: String,
    LINEA: String,
    GMAIL:String,
    ESTADO_FINAL: String,
    FECHA_REG: String,
    FECHA_ESTADO_FINAL: String
});

const EquipoModel = mongoose.model('Equipo',EquipoSchema, 'equipo');
module.exports = EquipoModel;