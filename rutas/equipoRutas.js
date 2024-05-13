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
  //Equipos por IMEI O SERIE
  rutas.get('/imeiseries/:imeiserie', async (req, res) => {
    const  imeiSerie = req.params.imeiserie;
    const regex = new RegExp(imeiSerie, 'i'); // 'i' para que sea insensible a mayúsculas/minúsculas
    try {
        const equipos = await EquipoModel.find({ "IMEI_SERIE": regex });
      
        res.json(equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//Equipos por tipo de dispositivo y estado inicial
rutas.get('/:tipo/:estadoInicial', async (req, res) => {
  try {
    const tipo = req.params.tipo;
    const estadoInicial = req.params.estadoInicial;
    const result = await EquipoModel.find({ "EQUIPO": tipo, "ESTADO_INICIAL": estadoInicial });
    res.json(result);
  } catch (err) {
      res.json({mensaje :  'Sin coincidencias'}); 
  }
});
  // Ruta para buscar dispositivos según cualquier campo
  rutas.get('/buscar_equipo', async (req, res) => {
    try {
      const query = req.query;
      
      const filter = {};
      for (const key in query) {
        if (typeof query[key] === 'string') {
          filter[key] = { $regex: new RegExp(query[key], 'i') };
        } else {
          filter[key] = query[key];
        }
      }
      const result = await EquipoModel.find(filter);
      res.json(result);
    } catch (error) {
       res.json({mensaje :  'Sin coincidencias'});   
    }
  });
//ordenamiento por cualquier campo,  ascendente
  rutas.get('/odenarequipos', async (req, res) => {
    const { orden } = req.query;
    try {
        const equipos = await EquipoModel.find().sort({ [orden]: 1 });
        res.json(equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//CANTIDAD DE EQUIPOS POR MARCA
rutas.get('/equipospormarca', async (req, res) => {
  try {
      const resultado = await EquipoModel.aggregate([
          {
              $group: {
                  _id: "$MARCA",
                  totalEquipos: { $sum: 1 }
              }
          },
          {
              $sort: { totalEquipos: -1 }
          }
      ]);
      res.json(resultado);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
// cantidad total de equipos y la fecha de registro más reciente por cada año y marca
rutas.get('/equiposconfecha', async (req, res) => {
    try {
        const resultado = await EquipoModel.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$FECHA_REG" }, MARCA: "$MARCA" },
                    totalEquipos: { $sum: 1 },
                    ultimaFechaRegistro: { $max: "$FECHA_REG" }
                }
            },
            {
                $sort: { "_id.year": 1, totalEquipos: -1 }
            }
        ]);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//por rango de fechas de registro
rutas.get('/equiposfechareg', async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    try {
        const equipos = await EquipoModel.find({
            FECHA_REG: {
                $gte: new Date(fechaInicio).toISOString,
                $lte: new Date(fechaFin).toISOString
            }
        });
        res.json(equipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Función para convertir fecha de texto a objeto de fecha
function convertirFecha(fechaTexto) {
  if (!fechaTexto) return null; // Validar si fechaTexto es null o undefined
  const [dia, mes, anio] = fechaTexto.split('/');
  return `${mes}-${dia}-${anio}`;
}
module.exports = rutas;
