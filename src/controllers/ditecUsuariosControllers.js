// const CustomError = require("../utils/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { conectarBaseDeDatos } = require("../database/dbSQL");

//MYSQL
const agregarUsuario = async (req, res) => {
    try {

        const {
            id_ciudadano,
            dni_ciudadano,
            nombre_ciudadano,
            email_ciudadano,
            clave_ciudadano,
            telefono_ciudadano,
            celular_ciudadano,
            domicilio,
            id_provincia,
            id_localidad,
            validado,
            fecha_carga,
            habilita
        } = req.body;

        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(clave_ciudadano, saltRounds);

        const connection = await conectarBaseDeDatos();

        const [user] = await connection.execute(
            'SELECT * FROM ciudadano WHERE email_ciudadano = ?',
            [email_ciudadano]
        );

        if (user.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO ciudadano (id_ciudadano, dni_ciudadano, nombre_ciudadano, email_ciudadano, clave_ciudadano, telefono_ciudadano, celular_ciudadano, domicilio, id_provincia, id_localidad, validado, fecha_carga, habilita) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id_ciudadano, dni_ciudadano, nombre_ciudadano, email_ciudadano, hashedPassword, telefono_ciudadano, celular_ciudadano, domicilio, id_provincia, id_localidad, validado, fecha_carga, habilita]
            );

            await connection.end();

            res.status(200).json({ message: "Ciudadano creado con éxito", insertedId: result.insertId });
        } else {
            res.status(400).json({ message: "Ciudadano ya existente", userEmail: user[0].email_ciudadano });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Algo salió mal :(" });
    }
};

// const login = async (req, res) => {
//     try {
//         const { email_ciudadano, password } = req.body;
//         if (!email_ciudadano || !password)
//             throw new CustomError("Usuario y contraseña son requeridas", 400);

//         const connection = await conectarBaseDeDatos();
//         const [result] = await connection.execute(
//             'SELECT * FROM ciudadano WHERE email_ciudadano = ?',
//             [email_ciudadano]
//         );

//         await connection.end();
//         if (result.length === 0) throw new CustomError("Usuario no encontrado", 404);

//         // Cambié result[0].contraseña a result[0].clave_ciudadano para reflejar el cambio en la estructura de la tabla
//         const passOk = await bcrypt.compare(password, result[0].clave_ciudadano);
//         if (!passOk) throw new CustomError("Contraseña incorrecta", 400);

//         const token = jwt.sign({ id: result[0].id_ciudadano }, process.env.JWT_SECRET_KEY, {
//             expiresIn: "8h",
//         });

       
//         res
//             .status(200)
//             .json({ message: "Ingreso correcto", ok: true, token });
//     } catch (error) {
//         res
//             .status(error.code || 500)
//             .json({ message: error.message || "algo explotó :|" });
//     }
// };


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




module.exports = {  agregarUsuario }