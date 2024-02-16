// const CustomError = require("../utils/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TYPES } = require('mssql');
const dotenv = require('dotenv');
dotenv.config();

const { conectarBaseDeDatos } = require("../database/dbSQL");
const { conectarMySql } = require("../database/dbMYSQL");

const nodemailer = require('nodemailer');

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Zoho',
    auth: {
      user: 'develop.ditec@zohomail.com', // Coloca tu dirección de correo electrónico
    //   pass: process.env.PASSWORD_GMAIL
      pass:"muni2024*" // Coloca tu contraseña
    }
  });
// const generarCodigoValidacion = () => {
//     // Genera un código de 4 dígitos aleatorio
//     return Math.floor(1000 + Math.random() * 9000);
//   };

  const generarCodigo=(numero)=> {
    const numeroInvertido = parseInt(numero.toString().split('').reverse().join(''));
    const ultimosCuatroDigitos = numeroInvertido % 10000;
    return ultimosCuatroDigitos;
  }



//MYSQL

const agregarUsuarioMYSQL = async (req, res) => {
    try {
        const {     
            documento_persona,
            nombre_persona,
            apellido_persona,
            email_persona,
            clave,
            telefono_persona,
            celular_persona,
            domicilio_persona,
            id_provincia,
            localidad_persona,
            id_pais,
            fecha_nacimiento_persona,
            id_genero,
            validado,
            habilita
        } = req.body;

        const codigoValidacion = generarCodigo(documento_persona);

        const hashedPassword = await bcrypt.hash(clave, 10);

        // Establecer la conexión a la base de datos MySQL
      
        const connection = await conectarMySql();

        // Conexión establecida, ahora puedes usarla
        connection.connect();

        // Consultar si ya existe un usuario con el mismo email o documento
        const queryEmail = `SELECT * FROM ciudadano WHERE email_persona = ?`;
        const queryDocumento = `SELECT * FROM ciudadano WHERE documento_persona = ?`;

        connection.query(queryEmail, [email_persona], async (errorEmail, resultEmail) => {
            if (errorEmail) {
                res.status(500).json({ message: errorEmail.message || "Error al verificar el email" });
            } else if (resultEmail.length > 0) {
                res.status(400).json({ message: "Email ya registrado", userEmail: email_persona });
            } else {
                connection.query(queryDocumento, [documento_persona], async (errorDocumento, resultDocumento) => {
                    if (errorDocumento) {
                        res.status(500).json({ message: errorDocumento.message || "Error al verificar el documento" });
                    } else if (resultDocumento.length > 0) {
                        res.status(400).json({ message: "DNI ya registrado", userDNI: documento_persona });
                    } else {
                        // Insertar el nuevo usuario
                        const queryInsert = `INSERT INTO ciudadano (documento_persona, nombre_persona, apellido_persona, email_persona, clave, telefono_persona, celular_persona, domicilio_persona, id_provincia, id_pais, localidad_persona, validado, habilita, fecha_nacimiento_persona, id_genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                        connection.query(queryInsert, [documento_persona, nombre_persona, apellido_persona, email_persona, hashedPassword, telefono_persona, celular_persona, domicilio_persona, id_provincia, id_pais, localidad_persona, validado, habilita, fecha_nacimiento_persona, id_genero], async (errorInsert, resultInsert) => {
                            if (errorInsert) {
                                res.status(500).json({ message: errorInsert.message || "Error al insertar el nuevo usuario" });
                            } else {
                                // Enviar correo electrónico al usuario recién registrado
                                const transporter = nodemailer.createTransport({
                                    host: 'tu_host_de_correo',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: 'tu_correo_electronico',
                                        pass: 'tu_contraseña'
                                    }
                                });

                                const mailOptions = {
                                    from: 'develop.ditec@zohomail.com', // Coloca tu dirección de correo electrónico
                                    to: email_persona, // Utiliza el correo electrónico del usuario recién registrado
                                    subject: 'Código de validación',
                                    text: `Tu código de validación es: ${codigoValidacion}`
                                };
                                
                                transporter.sendMail(mailOptions, (errorEmail, info) => {
                                    if (errorEmail) {
                                        console.error('Error al enviar el correo electrónico:', errorEmail);
                                    } else {
                                        console.log('Correo electrónico enviado correctamente:', info.response);
                                    }
                                });

                                res.status(200).json({ message: "Ciudadano creado con éxito" });
                            }
                        });
                    }
                });
            }
        });

        connection.end();
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};






//SQL SERVER
const agregarUsuario = async (req, res) => {
    try {
        const {     
      documento_persona,
      nombre_persona,
      apellido_persona,
      email_persona,
      clave,
      telefono_persona,
      celular_persona,
      domicilio_persona,
      id_provincia,
      localidad_persona,
      id_pais,
      fecha_nacimiento_persona,
      id_genero,
      validado,
      habilita
        } = req.body;

         const codigoValidacion = generarCodigo(documento_persona);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(clave, saltRounds);

        const connection = await conectarBaseDeDatos();

        try {
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_persona = ${email_persona}`;
            const queryResult2 = await connection.query`SELECT * FROM ciudadano WHERE documento_persona = ${documento_persona}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0 && queryResult.recordsets[0].length > 0) {
                // Ya existe un usuario con el mismo email
                res.status(400).json({ message: "Email ya registrado", userEmail: email_persona });
            }
            
            else if(queryResult2.recordsets && queryResult2.recordsets.length > 0 && queryResult2.recordsets[0].length > 0) {
                res.status(400).json({ message: "DNI ya registrado", userDNI: documento_persona });
            }
    
            
            
            
            else {
                // No hay registros con el mismo email, puedes proceder con la inserción
                const result = await connection.query`INSERT INTO ciudadano (documento_persona, nombre_persona,apellido_persona, email_persona, clave, telefono_persona, celular_persona, domicilio_persona, id_provincia,id_pais, localidad_persona, validado, habilita,fecha_nacimiento_persona,id_genero ) VALUES (${documento_persona}, ${nombre_persona},${apellido_persona}, ${email_persona}, ${clave}, ${telefono_persona}, ${celular_persona}, ${domicilio_persona}, ${id_provincia},${id_pais} ,${localidad_persona}, ${validado}, ${habilita},${fecha_nacimiento_persona},${id_genero})`;

        

// Enviar correo electrónico al usuario recién registrado
const mailOptions = {
    from: 'develop.ditec@zohomail.com', // Coloca tu dirección de correo electrónico
    to: email_persona, // Utiliza el correo electrónico del usuario recién registrado
    subject: 'Código de validación',
    text: `Tu código de validación es: ${codigoValidacion}`
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado correctamente:', info.response);
    }
  });



 res.status(200).json({ message: "Ciudadano creado con éxito" });


            }
        } catch (error) {
            res.status(500).json({ message: error.message || "Algo salió mal :(" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};
const validarUsuario = async (req, res) => {
    try {
        const { email_persona, codigo_verif } = req.body;

        const connection = await conectarBaseDeDatos();

        try {
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_persona = ${email_persona}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0 && queryResult.recordsets[0].length > 0) {
                const usuario = queryResult.recordsets[0][0];
          const codigo=generarCodigo(usuario.documento_persona);
                if (!usuario.validado) {
                    // Verificar si el código de verificación coincide
                    if (codigo === codigo_verif) {
                        // El usuario existe, el código de verificación coincide y no está validado, proceder con la actualización
                        const result = await connection.query`UPDATE ciudadano SET validado = 1 WHERE email_persona = ${email_persona}`;
                        res.status(200).json({ message: "Usuario validado con éxito",ok:true });
                    } else {
                        // El código de verificación no coincide
                        res.status(200).json({ message: "El código de verificación es incorrecto",ok:false });
                    }
                } else {
                    // El usuario ya está validado
                    res.status(400).json({ message: "El usuario ya está validado" });
                }
            } else {
                // No se encontró el usuario
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message || "Algo salió mal :(" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};

const obtenerTodosLosCiudadanos = async (req, res) => {
    try {
        const connection = await conectarBaseDeDatos();

        try {
            const queryResult = await connection.query`SELECT * FROM ciudadano`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0) {
                const ciudadanos = queryResult.recordsets[0];
                res.status(200).json({ ciudadanos });
            } else {
                res.status(404).json({ message: "No se encontraron usuarios" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message || "Algo salió mal :(" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};

const obtenerCiudadanoPorDNI = async (req, res) => {
    try {
        const connection = await conectarBaseDeDatos();

        try {
            const userDNI = req.params.dni; // Obtener el ID del usuario de los parámetros de la URL
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE documento_persona = ${userDNI}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0) {
                const ciudadano = queryResult.recordsets[0][0]; // Suponiendo que solo hay un usuario con ese ID
                if (ciudadano) {
                    res.status(200).json({ ciudadano });
                } else {
                    res.status(200).json({ message: "Usuario no encontrado" });
                }
            } else {
                res.status(200).json({ message: "No se encontraron usuarios" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message || "Algo salió mal :(" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};

const obtenerCiudadanoPorEMAIL = async (req, res) => {
    try {
        const connection = await conectarBaseDeDatos();

        try {
            const userEMAIL = req.params.email; // Obtener el ID del usuario de los parámetros de la URL
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_persona = ${userEMAIL}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0) {
                const ciudadano = queryResult.recordsets[0][0]; // Suponiendo que solo hay un usuario con ese ID
                if (ciudadano) {
                    res.status(200).json({ ciudadano });
                } else {
                    res.status(200).json({ message: "Usuario no encontrado" });
                }
            } else {
                res.status(200).json({ message: "No se encontraron usuarios" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message || "Algo salió mal :(" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};

const login = async (req, res) => {
    try {
        const { email_persona, clave } = req.body;
        if (!email_persona || !clave) {
            return res.status(400).json({ message: "Usuario y contraseña son requeridas", ok: false });
        }

        const connection = await conectarBaseDeDatos();
        const queryResult = await connection.query(`SELECT * FROM ciudadano WHERE email_persona =  '${email_persona}'`);
        
        if (!queryResult.recordsets[0][0]) {
            return res.status(200).json({ message: "Usuario no encontrado", ok: false });
        } 

        const passOk = await bcrypt.compare(clave, queryResult.recordsets[0][0].clave.trim());
        
        if (!passOk) {
            return res.status(200).json({ message: "Contraseña incorrecta", ok: false });
        }

        // const token = jwt.sign({ id: result[0].id_ciudadano }, process.env.JWT_SECRET_KEY, {
        //     expiresIn: "8h",
        // });

        return res.status(200).json({ message: "Ingreso correcto", ok: true });
    } catch (error) {
        return res.status(error.code || 500).json({ message: error.message || "algo explotó :|" });
    }
};


// const getAuthStatus = async (req, res) => {
//     try {
//         const id = req.id;

//         const connection = await conectarBaseDeDatos();
//         const [user] = await connection.execute(
//             'SELECT * FROM ciudadano WHERE id = ?',
//             [id]
//         );

//         if (user.length == 0) throw new CustomError("Autenticación fallida", 401);
//         const { clave_ciudadano, ...usuarioSinContraseña } = user[0];
//         res.status(200).json({ usuarioSinContraseña });
//     } catch (error) {
//         res.status(error.code || 500).json({
//             message:
//                 error.message || "Ups! Hubo un problema, por favor intenta más tarde",
//         });
//     }
// };




module.exports = {  agregarUsuario ,validarUsuario,obtenerTodosLosCiudadanos,obtenerCiudadanoPorDNI, obtenerCiudadanoPorEMAIL,login}