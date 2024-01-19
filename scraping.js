const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 3002;

app.get('/', async (req, res) => {
  try {
    const url = 'https://elpais.com/ultimas-noticias/';  // Reemplaza con la URL de la página que quieres hacer scraping

    // Realizar la solicitud HTTP
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Obtener los elementos dentro de .b-st_a
    const elementos = $('.b-st_a article.c.c-d.c--m');

    // Lista para almacenar los objetos
    const noticias = [];

    // Iterar sobre los elementos y realizar scraping en cada artículo
    elementos.each((_, elemento) => {
      const titulo = $(elemento).find('header.c_h').text().trim();
      const imagen = $(elemento).find('img').attr('src');
      const descripcion = $(elemento).find('p.c_d').text().trim();
      const enlace = $(elemento).find('a').attr('href');

      // Crear objeto con los datos
      const noticia = {
        titulo: titulo,
        imagen: imagen,
        descripcion: descripcion,
        enlace: enlace,
      };

      // Agregar noticia a la lista
      noticias.push(noticia);
    });

    // Escribir la lista de noticias en un archivo JSON
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));

    res.send('Scraping completado. Datos guardados en noticias.json');
  } catch (error) {
    console.error('Error al realizar la solicitud:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
