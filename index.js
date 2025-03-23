const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config()

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN;

// ROUTE 1: GET for the homepage to display the list of Pet custom objects
app.get('/', async (req, res) => {
    const petsUrl = 'https://api.hubapi.com/crm/v3/objects/2-140672354?properties=name,breed,species';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(petsUrl, { headers });

        const customObjects = response.data.results;
        res.render('homepage', { title: 'Pet Records | HubSpot', customObjects });
    } catch (error) {
        console.error(error);
        res.send('Error fetching Pet data');
    }
});

// ROUTE 2: GET for the form to create or update a Pet custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | HubSpot Integration' });
});

// ROUTE 3: POST to handle form submission and create a new Pet record
app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            breed: req.body.breed,
        }
    };

    const petsUrl = 'https://api.hubspot.com/crm/v3/objects/2-140672354';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(petsUrl, newPet, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send('Error creating new Pet record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
