const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 3000;

app.get(`/`, async (req, res) => {
    try {
        const url = 'https://elpais.com/ultimas-noticias/';
        const response = await axios.get(url)
        const html = response.data;
        const $ = cheerio.load(html);

        const divNew = $('.b-st_a article.c.c-d.c--m');

        let noticias = [];

        divNew.each((index, element) => {
            const titulo = $(element).find('header.c_h').text();
            const imagenes = $(element).find('img').attr('src');
            //console.log(imagenes);
            const descripcion = $(element).find('p.c_d').text();
            const enlace = $(element).find('a').attr('href');

            const noticia = {
                id: noticias.length + 1,
                titulo: titulo,
                imagen: imagenes,
                descripcion: descripcion,
                enlace: enlace,
            };
            noticias.push(noticia);
        });

        res.send('Datos guardados en noticias.json');

        fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));

    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Express esta escuchando en http://localhost:${port}`);
})