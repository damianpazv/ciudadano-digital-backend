// const CustomError = require("../utils/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TYPES } = require('mssql');

const { conectarBaseDeDatos } = require("../database/dbSQL");

//MYSQL
const agregarUsuario = async (req, res) => {
    try {
        const {
            
            dni_ciudadano,
            nombre_ciudadano,
            email_ciudadano,
            clave_ciudadano,
            telefono_ciudadano,
            celular_ciudadano,
            domicilio,
            provincia,
            localidad,
            validado,
            fecha_carga,
            habilita
        } = req.body;

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(clave_ciudadano, saltRounds);

        const connection = await conectarBaseDeDatos();

        try {
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_ciudadano = ${email_ciudadano}`;
            const queryResult2 = await connection.query`SELECT * FROM ciudadano WHERE dni_ciudadano = ${dni_ciudadano}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0 && queryResult.recordsets[0].length > 0) {
                // Ya existe un usuario con el mismo email
                res.status(400).json({ message: "Email ya registrado", userEmail: email_ciudadano });
            }
            
            else if(queryResult2.recordsets && queryResult2.recordsets.length > 0 && queryResult2.recordsets[0].length > 0) {
                res.status(400).json({ message: "DNI ya registrado", userDNI: dni_ciudadano });
            }
    
            
            
            
            else {
                // No hay registros con el mismo email, puedes proceder con la inserción
                const result = await connection.query`INSERT INTO ciudadano ( dni_ciudadano, nombre_ciudadano, email_ciudadano, clave_ciudadano, telefono_ciudadano, celular_ciudadano, domicilio, provincia, localidad, validado, fecha_carga, habilita) VALUES ( ${dni_ciudadano}, ${nombre_ciudadano}, ${email_ciudadano}, ${hashedPassword}, ${telefono_ciudadano}, ${celular_ciudadano}, ${domicilio}, ${provincia}, ${localidad}, ${validado}, ${fecha_carga}, ${habilita})`;
        
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
        const { email_ciudadano } = req.body;

        const connection = await conectarBaseDeDatos();

        try {
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_ciudadano = ${email_ciudadano}`;

            if (queryResult.recordsets && queryResult.recordsets.length > 0 && queryResult.recordsets[0].length > 0) {
                const usuario = queryResult.recordsets[0][0];

                if (!usuario.validado) {
                    // El usuario existe y no está validado, proceder con la actualización
                    const result = await connection.query`UPDATE ciudadano SET validado = 1 WHERE email_ciudadano = ${email_ciudadano}`;
                    res.status(200).json({ message: "Usuario validado con éxito" });
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
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE dni_ciudadano = ${userDNI}`;

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
            const queryResult = await connection.query`SELECT * FROM ciudadano WHERE email_ciudadano = ${userEMAIL}`;

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
        const { email_ciudadano, clave_ciudadano } = req.body;
        if (!email_ciudadano || !clave_ciudadano) {
            return res.status(400).json({ message: "Usuario y contraseña son requeridas", ok: false });
        }

        const connection = await conectarBaseDeDatos();
        const queryResult = await connection.query(`SELECT * FROM ciudadano WHERE email_ciudadano =  '${email_ciudadano}'`);
        
        if (!queryResult.recordsets[0][0]) {
            return res.status(200).json({ message: "Usuario no encontrado", ok: false });
        } 

        const passOk = await bcrypt.compare(clave_ciudadano, queryResult.recordsets[0][0].clave_ciudadano.trim());
        
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