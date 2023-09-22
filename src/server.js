require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')


const port = process.env.PORT || 8000
const app = express()


app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

async function getRandomComic() {
  try {
    const randomComic = Math.floor(Math.random() * 2500) + 1;
    const response = await axios.get(`${process.env.COMIC_API}/${randomComic}/info.0.json`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching a comic: ${error.message}`);
    return null; 
  }
}

async function getRandomComics(req, res) {
  try {
    const numberOfComics = 10;
    const randomComics = await Promise.all(Array.from({ length: numberOfComics }, getRandomComic));

    const validComics = randomComics.filter(comic => comic !== null);

    res.json(validComics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

app.get('/randomComics', getRandomComics )


app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
})