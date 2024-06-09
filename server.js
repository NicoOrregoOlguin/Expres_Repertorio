const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); 

const filePath = './repertorio.json';


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET 
app.get('/canciones', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        res.json(JSON.parse(data));
    });
});

// POST
app.post('/canciones', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        const canciones = JSON.parse(data);
        canciones.push(req.body);
        fs.writeFile(filePath, JSON.stringify(canciones), err => {
            if (err) {
                return res.status(500).send('Error guardando el archivo.');
            }
            res.status(201).send('Canción agregada');
        });
    });
});

// PUT 
app.put('/canciones/:id', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        let canciones = JSON.parse(data);
        const index = canciones.findIndex(c => c.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).send('Canción no encontrada.');
        }
        canciones[index] = req.body;
        fs.writeFile(filePath, JSON.stringify(canciones), err => {
            if (err) {
                return res.status(500).send('Error guardando el archivo.');
            }
            res.send('Canción actualizada');
        });
    });
});

// DELETE 
app.delete('/canciones/:id', (req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo el archivo.');
        }
        let canciones = JSON.parse(data);
        const newCanciones = canciones.filter(c => c.id !== parseInt(req.params.id));
        if (newCanciones.length === canciones.length) {
            return res.status(404).send('Canción no encontrada.');
        }
        fs.writeFile(filePath, JSON.stringify(newCanciones), err => {
            if (err) {
                return res.status(500).send('Error guardando el archivo.');
            }
            res.send('Canción eliminada');
        });
    });
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
