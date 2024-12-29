
const express = require('express');
require('dotenv').config();
const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    createTable,
    createDatabase
} = require('./service.js');

const app = express();
const cors = require('cors')

const port = 8000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const spreadsheetId = "1T01_nEN6Oqwg-EeoP9fORrxuoHiJvqPizcxKZm2uH6Q";
const sheetName = "Sheet1";

app.get('/testGetSpreadSheet', async (req, res) => {
    try {
        const authToken = await getAuthToken();
        const response = await getSpreadSheet({
            spreadsheetId,
            auth: authToken
        });
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/testGetSpreadSheetValues', async (req, res) => {
    try {
        const authToken = await getAuthToken();
        const response = await getSpreadSheetValues({
            spreadsheetId,
            sheetName: sheetName,
            auth: authToken
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/createTable", async (req, res) => {
    try {
        const body = req.body;
        const table_name = body.table_name;
        if (!table_name) {
            res.status(400).send("Table Name is required");
            return;
        }

        const authToken = await getAuthToken();
        const response = await createTable({
            spreadsheetId,
            auth: authToken,
            sheetName: table_name
        });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

app.post("/createDatabase", async (req, res) => {
    try {
        const body = req.body;
        const { database_name, owner_email } = body;

        if (!database_name) {
            res.status(400).send("Database Name is required");
            return;
        }

        const authToken = await getAuthToken();
        const response = await createDatabase({
            auth: authToken,
            title: database_name,
            owner: owner_email
        });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, async () => {
    console.clear()
    console.log(`Server is running on port http://localhost:${port}`);
});

