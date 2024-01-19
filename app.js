const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

let noticias = [];

// Leer datos desde el archivo JSON
function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

// Guardar datos en el archivo JSON
function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

// Obtener todas las noticias
app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});

// Obtener una noticia por su índice
app.get('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    res.json(noticias[indice]);
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

// Crear una nueva noticia
app.post('/noticias', (req, res) => {
  leerDatos();

  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);

  guardarDatos();
  res.json({ mensaje: 'Noticia creada con éxito', noticia: nuevaNoticia });
});

// Actualizar una noticia existente
app.put('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    const noticiaActualizada = req.body;
    noticias[indice] = noticiaActualizada;

    guardarDatos();
    res.json({ mensaje: 'Noticia actualizada con éxito', noticia: noticiaActualizada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

// Eliminar una noticia
app.delete('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  leerDatos();

  if (indice >= 0 && indice < noticias.length) {
    const noticiaEliminada = noticias.splice(indice, 1);

    guardarDatos();
    res.json({ mensaje: 'Noticia eliminada con éxito', noticia: noticiaEliminada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.listen(port, () => {
  console.log(`Servidor CRUD escuchando en http://localhost:${port}`);
});
