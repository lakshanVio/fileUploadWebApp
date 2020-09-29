const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require("fs");
const formidable = require('formidable');
const credentialsFile = require('./credentialsFile.json');

const client_id = credentialsFile.web.client_id;
const client_secret = credentialsFile.web.client_secret;
const redirect_uris = credentialsFile.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const SCOPE = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file']

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Sri file upload backend runnning'));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server has Started ${PORT}`));