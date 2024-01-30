//importar ibrerias 
const express = require('express');
const router = require('./routes');
const dbconection = require('./database/config');

const cors=require('cors');
const { notFoundHandler } = require('./middlewares/notFound');
const { errorHandler } = require('./middlewares/error');
const { conectarBaseDeDatos } = require('./database/dbSQL');
const { pool } = require('mssql');
require("dotenv").config();

//crear app
const app = express();

const PORT=process.env.PORT || 4040; 

//conectar base de datos
//dbconection();

    console.log('Error al conectar con la base de datos'); 
  
    // Este bloque se ejecutará tanto si la conexión tiene éxito como si falla
    // Aquí puedes poner el código para iniciar el servidor
    // y cualquier otra acción que deba ocurrir independientemente del resultado de la conexión.
    
    // Middlewares
    app.use(cors());
    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  
    // Rutas
    app.use("/api", router);
  
    app.use(notFoundHandler);
    app.use(errorHandler);
  
    // Inicializar servidor
    app.listen(PORT, () => {
      console.log(`Servidor inicializado en el puerto ${PORT}`);
    });
  