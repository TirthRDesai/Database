const { DataFrame } = require("dataframe-js");
const express = require('express');
const CryptoJS = require("crypto-js");
require('dotenv').config();
const {
    getAuthToken,
    createTable,
    createDatabase,
    getAuthUrl,
    getTokens
} = require('./service.js');

const {
    getServiceAuthToken,
    getUserTokenDB,
    getUserTokenSheet,
    addToken,
    findUser,
    replace_tokens
} = require("./user-token.js")

const {
    fetchProfile
} = require("./utils.js")

const app = express();
const cors = require('cors');
const { default: axios } = require("axios");
const Helper = require("./Helper.js");
const cookieParser = require('cookie-parser');

const port = 8000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.post("/api/database/getAllDatabases", async (req, res) => {
    try {
        const authToken = await getAuthToken();
        const response = await getSpreadSheet({
            spreadsheetId,
            auth: authToken
        });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
})

app.get("/api/database/getAllDatabases", async (req, res) => { })

app.post("/api/database/createTable", async (req, res) => {
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

app.post("/api/database/createDatabase", async (req, res) => {
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

app.get("/api/auth/getAuthURL", async (req, res) => {
    try {
        const state = req.query.state;
        if (!state) {
            res.status(400).send("State is required");
            return;
        }
        const authURL = await getAuthUrl(state);

        res.send({
            authURL
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get("/api/user/oauth2callback", async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            res.cookie("callbackresponse", JSON.stringify({
                status: "Failed",
                message: "Code is required"
            }), {
                maxAge: 900000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            });

            res.redirect("http://localhost:3000/auth/google/oauth2callback");
            return;
        }
        const tokens = await getTokens(code);
        if (!tokens || !tokens.access_token || !tokens.refresh_token || !tokens.expiry_date) {
            res.cookie("callbackresponse", JSON.stringify({
                status: "Failed",
                message: "Invalid Code"
            }), {
                maxAge: 900000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"

            });

            res.redirect("http://localhost:3000/auth/google/oauth2callback");
            return;
        }
        const profile = await fetchProfile(tokens.access_token);
        if (!profile || !profile.data) {
            res.cookie("callbackresponse", JSON.stringify({
                status: "Failed",
                message: "Invalid Profile",

            }), {
                maxAge: 900000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"

            });

            res.redirect("http://localhost:3000/auth/google/oauth2callback");
            return;
        }

        const service_auth = await getServiceAuthToken();
        const user = await findUser(service_auth, profile.data.email);
        let response_from_db;
        if (!user) {
            response_from_db = await addToken(service_auth, tokens, profile.data.email);
        }
        else {
            response_from_db = await replace_tokens(service_auth, tokens, profile.data.email);
        }

        if (!response_from_db || response_from_db.status === "Failed" || response_from_db.status === "Error") {
            res.cookie("callbackresponse", JSON.stringify({
                status: "Failed",
                message: "Token add failed",
                data: response_from_db
            }), {
                maxAge: 900000,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"

            });

            res.redirect("http://localhost:3000/auth/google/oauth2callback");
            return;
        }
        res.cookie("callbackresponse", JSON.stringify({
            status: "Success",
            message: "Token added successfully",
            token: Helper.encryptJSON(tokens),
            profile: profile.data
        }), {
            maxAge: 900000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"

        });

        res.redirect("http://localhost:3000/auth/google/oauth2callback");
        return;
    } catch (error) {
        res.cookie("callbackresponse", JSON.stringify({
            status: "Error",
            message: error
        }), {
            maxAge: 900000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"

        });
    }
})

app.get("/api/manager/cookies", async (req, res) => {
    try {
        console.clear()
        const { name } = req.query;
        if (!name) {
            res.status(400).send({
                status: "Failed",
                message: "Name is required"
            });
            return;
        }
        const cookies = req.cookies;
        const cookie = cookies[name];
        if (!cookie) {
            res.status(400).send({
                status: "Failed",
                message: "Cookie not found"
            });
            return;
        }

        res.send({
            status: "Success",
            message: "Cookie found",
            value: cookie
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: error
        });
    }
})


app.listen(port, async () => {
    console.clear()
    console.log(`Server is running on port http://localhost:${port}`);
});

