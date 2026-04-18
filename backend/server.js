const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 LOG GENERAL (todas las peticiones)
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.url}`);
    next();
});

// 🔥 CONEXIÓN
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "farmacia_florencia",
    password: "1234",
    port: 5433
});

// =====================
// TEST
// =====================
app.get("/", async (req, res) => {
    try {
        await pool.query("SELECT NOW()");
        res.send("Conectado a PostgreSQL 🚀");
    } catch (error) {
        res.send("Error conexión ❌");
    }
});

// =====================
// LOGIN
// =====================
app.post("/login", async (req, res) => {

    const { usuario, password } = req.body;

    console.log("🔐 Intento de login");
    console.log("Usuario:", usuario);
    console.log("Password:", password);

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE usuario=$1 AND password=$2",
            [usuario, password]
        );

        if(result.rows.length > 0){

            console.log("✅ LOGIN CORRECTO:", usuario);

            res.json({
                success:true,
                rol: result.rows[0].rol
            });

        }else{

            console.log("❌ LOGIN FALLIDO:", usuario);

            res.json({ success:false });
        }

    } catch (error) {
        console.log("💥 ERROR EN LOGIN:", error);
        res.status(500).send("Error servidor");
    }
});

// =====================
// REGISTRAR
// =====================
app.post("/usuarios", async (req, res) => {

    const { usuario, password, nombre } = req.body;

    try {

        console.log("👤 Registro de usuario:", usuario);

        // 🔒 VALIDAR PASSWORD 8 DÍGITOS
        if(!/^[0-9]{8}$/.test(password)){
            return res.json({
                success:false,
                mensaje:"Contraseña debe ser 8 números"
            });
        }

        // 🔍 VERIFICAR SI EXISTE
        const existe = await pool.query(
            "SELECT * FROM usuarios WHERE usuario=$1",
            [usuario]
        );

        if(existe.rows.length > 0){
            return res.json({
                success:false,
                mensaje:"Usuario ya existe"
            });
        }

        // 🔥 FORZAR ROL EMPLEADO
        let rolFinal = "empleado";

        await pool.query(
            "INSERT INTO usuarios(usuario,password,nombre,rol) VALUES($1,$2,$3,$4)",
            [usuario,password,nombre,rolFinal]
        );

        console.log("✅ Usuario registrado:", usuario);

        res.json({ success:true });

    } catch (error) {
        console.log("💥 ERROR EN REGISTRO:", error);
        res.status(500).send("Error servidor");
    }
});

// =====================
// OBTENER USUARIOS
// =====================
app.get("/usuarios", async (req, res) => {

    try {
        const result = await pool.query(
            "SELECT id, usuario, nombre, rol FROM usuarios ORDER BY id"
        );
        res.json(result.rows);
    } catch (error) {
        console.log("💥 ERROR AL OBTENER USUARIOS:", error);
        res.status(500).send("Error servidor");
    }

});

// =====================
// ELIMINAR
// =====================
app.delete("/usuarios/:id", async (req, res) => {

    const { id } = req.params;

    try {

        console.log("🗑 Eliminando usuario ID:", id);

        await pool.query(
            "DELETE FROM usuarios WHERE id=$1",
            [id]
        );

        res.json({ success:true });
    } catch (error) {
        console.log("💥 ERROR AL ELIMINAR:", error);
        res.status(500).send("Error servidor");
    }

});

// =====================
// EDITAR
// =====================
app.put("/usuarios/:id", async (req, res) => {

    const { id } = req.params;
    const { usuario, nombre, rol } = req.body;

    try {

        console.log("✏️ Editando usuario ID:", id);

        await pool.query(
            "UPDATE usuarios SET usuario=$1, nombre=$2, rol=$3 WHERE id=$4",
            [usuario, nombre, rol, id]
        );

        res.json({ success:true });

    } catch (error) {
        console.log("💥 ERROR AL EDITAR:", error);
        res.status(500).send("Error servidor");
    }

});

// =====================
app.listen(3000, ()=>{
    console.log("Servidor corriendo 🚀");
});

// =====================
// INVENTARIO
// =====================

// 🔹 OBTENER INVENTARIO
app.get("/inventario", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM inventario ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error servidor");
    }
});

// 🔹 REGISTRAR MEDICAMENTO
app.post("/inventario", async (req, res) => {

    const { codigo, nombre, precio, lote, caducidad, cantidad } = req.body;

    try {

        console.log("💊 Registrando medicamento:", nombre);

        const existe = await pool.query(
            "SELECT * FROM inventario WHERE codigo = $1",
            [codigo]
        );

        if(existe.rows.length > 0){
            return res.json({ success: false, mensaje: "Código ya existe" });
        }

        await pool.query(
            "INSERT INTO inventario (codigo,nombre,precio,lote,caducidad,cantidad) VALUES ($1,$2,$3,$4,$5,$6)",
            [codigo,nombre,precio,lote,caducidad,cantidad]
        );

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error servidor");
    }

});

// 🔹 ELIMINAR
app.delete("/inventario/:codigo", async (req, res) => {

    const { codigo } = req.params;

    try {

        console.log("🗑 Eliminando medicamento:", codigo);

        await pool.query(
            "DELETE FROM inventario WHERE codigo = $1",
            [codigo]
        );

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error servidor");
    }

});

// =====================
// ACTUALIZAR MEDICAMENTO
// =====================

app.put("/inventario/:codigo", async (req, res) => {

    const { codigo } = req.params;
    const { nombre, precio, lote, caducidad, cantidad } = req.body;

    try {

        console.log("✏️ Actualizando medicamento:", codigo);

        await pool.query(
            `UPDATE inventario 
             SET nombre=$1, precio=$2, lote=$3, caducidad=$4, cantidad=$5 
             WHERE codigo=$6`,
            [nombre, precio, lote, caducidad, cantidad, codigo]
        );

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error servidor");
    }

});