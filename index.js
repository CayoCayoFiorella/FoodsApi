const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const https = require('https');

const app = express();

// Middleware para habilitar CORS
app.use(cors());

const options = {
    key: fs.readFileSync('private.key'),  // Ruta a tu archivo private.key
    cert: fs.readFileSync('cert.cert')     // Ruta a tu archivo cert.crt
};

// Leer el archivo CSV y cargar los datos en memoria
let alimentos = [];
const cargarDatos = () => {
    fs.createReadStream('datos.csv')
        .pipe(csv({ separator: ';' })) // Especificar el delimitador como punto y coma
        .on('data', (row) => {
            // Convertir los valores numéricos
            row.proteina = parseFloat(row.proteina);
            row.grasa = parseFloat(row.grasa);
            row.carbohidrato = parseFloat(row.carbohidrato);
            row.energia = parseFloat(row.energia);

            alimentos.push(row);
        })
        .on('end', () => {
            console.log('Archivo CSV cargado correctamente.');
        })
        .on('error', (err) => {
            console.error('Error al leer el archivo CSV:', err);
        });
};

// Cargar los datos al iniciar el servidor
cargarDatos();

// Ruta raíz
app.get('/', (req, res) => {
    res.send('API Local funcionando');
});

// Ruta para obtener los alimentos
app.get('/alimentos', (req, res) => {
    res.json(alimentos);
});

// Iniciar el servidor HTTPS
const PORT = 3000;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});

