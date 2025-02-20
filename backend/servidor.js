const express = require('express');
const path = require('path');// me permite manejar rutas de archivos
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');// para que se pueda acceder desde diferentes dominios 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



// Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Ruta herramientas
app.get('/herramientas-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'herramienta.html'));
});

// Configuración de la conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'suindufer',
});

db.connect(error => {
    if (error) {
        console.error('Error de conexión:', error);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});
//1.Peeticion get de todo el inventario

//1.1 Obtener todas las herramientas
app.get('/herramientas', function(req, res) {
    db.query('SELECT * FROM herramientas', function(error, resultados) {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener registros de herramientas' });
        }
        res.json(resultados);
    });
});

//1.2 Obtener toda la fontaneria
app.get('/fontaneria',function(req,res){
db.query('SELECT * FROM fontaneria',function(error,resultado){
    if(error){
        return res.status(500).json({ error: 'Error al obtener registros de fontaneria' });
    }
    res.json(resultado);
});
});

 
//2.Peticion get con ID de todo el inventario.

//2.1Obtener una herramienta por ID
app.get('/herramientas/:id', function(req, res) {
    const { id } = req.params;
    db.query('SELECT * FROM herramientas WHERE id = ?', [id], function(error, resultados) {
        if (error)
             return res.status(500).json({ error: 'Error al obtener el registro' });
        if (resultados.length === 0) 
            return res.status(404).json({ error: 'Registro no encontrado' });
        res.json(resultados[0]);
    });
});

//2.2 Obtener fontaneria por ID
app.get('/fontaneria/:id',function(req,res){
    const{ id }=req.params;
    db.query('SELECT *FROM fontaneria WHERE id= ?',[id], function(error,resultados){
        if(error)
           return res.status(500).json({error:'Error al obtener registro de fontaneria'});
        if(resultados.length ===0)
            return res.status(404).json({error:'Registro no encontrado'});
        res.json(resultados[0]);
    });
});

//---3.Peticion post del inventario---

//3.1 Crear una herramienta
app.post('/herramientas', function(req, res) {
    const { nombre, stock, proveedor, costo } = req.body;
    if (!nombre || !stock || !proveedor || costo == null) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    const query = 'INSERT INTO herramientas (nombre, stock, proveedor, costo) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, stock, proveedor, costo], function(error, resultados) {
        if (error) 
            return res.status(500).json({ error: 'Error al crear el registro' });
        res.status(201).json({ id: resultados.insertId, nombre, stock, proveedor, costo });
    });
});

//3.2 Crear fontaneria
app.post('/fontaneria',function(res,req){
    const {nombre,stock,proveedor,costo} = req.body;
    if(!nombre || !stock || !proveedor || !costo == null){
        return res.status(400).json({error:'Faltan datos'});
    }
    const query ='INSERT INTO fontaneria (nombre, stock, proveedor, costo) VALUES (?, ?, ?, ?)'
    db.query(query,[nombre,stock,proveedor,costo],function(error,resultados){
        if(error)
            return res.status(500).json({error: 'Error al crear registro de fontaneria'});
        res.status(201).json({id:resultados.insertId,nombre, stock, proveedor, costo});
    });
});

//4.Solicitud put
//4.1 Actualizar una herramienta
app.put('/herramientas/:id', function(req, res) {
    const { id } = req.params;
    const { nombre, stock, proveedor, costo } = req.body;
    if (!nombre || !stock || !proveedor || costo == null) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    const query = 'UPDATE herramientas SET nombre = ?, stock = ?, proveedor = ?, costo = ? WHERE id = ?';
    db.query(query, [nombre, stock, proveedor, costo, id], function(error, resultados)  {
        if (error)
             return res.status(500).json({ error: 'Error al actualizar el registro' });
        if (resultados.affectedRows === 0) 
            return res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro actualizado correctamente' });
    });
});
//4.2 Actualizar fontaneria
app.put('/fontaneria/:id',function(req,res){
    const {id} =req.params;
    const {nombre,stock,proveedor,costo}=req.body;
    if (!nombre || !stock || !proveedor || costo == null) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    const query = 'UPDATE fontaneria SET nombre = ?, stock = ?, proveedor = ?, costo = ? WHERE id = ?';
    db.query(query, [nombre, stock, proveedor, costo, id], function(error, resultados)  {
        if (error)
             return res.status(500).json({ error: 'Error al actualizar el registro' });
        if (resultados.affectedRows === 0) 
            return res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro actualizado correctamente' });
    });
});

//5.Solicitud delete

//5.1 Eliminar una herramienta
app.delete('/herramientas/:id', function(req, res)  {
    const { id } = req.params;
    db.query('DELETE FROM herramientas WHERE id = ?', [id], function(error, resultados) {
        if (error) 
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        if (resultados.affectedRows === 0) 
            return res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro eliminado correctamente' });
    });
});

//5.2 Eliminar fontaneria
app.delete('/fontaneria/:id',function(req,res){
    const{ id }= req.params;
    db.query('DELETE FROM fontaneria WHERE id = ?'[id], function(error,resultado){
        if(error)
            return res.status(500).json({ error: 'Error al eliminar el registro' });
        if(resultados.affectedRows===0)
            return  res.status(404).json({ error: 'Registro no encontrado' });
        res.json({ message: 'Registro eliminado correctamente' });
    });
});


// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

