const express = require("express");
const application = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");
const formidable = require("formidable");
const credentialsFile = require("./credentialsFile.json");

const client_id = credentialsFile.web.client_id;
const client_secret = credentialsFile.web.client_secret;
const redirect_uris = credentialsFile.web.redirect_uris;
const client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPE = [
  "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file",
];

application.use(cors());
application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());

application.post("/accessdrive", (request, response) => {
  token = request.body.token;
  if (token == null) return response.status(400).send("Cannot Find the Token");
  client.setCredentials(token);
  const googleDrive = google.drive({ version: "v3", auth: client });
  googleDrive.files.list(
    {
      pageSize: 7,
    },
    (error, res) => {
      if (error) {
        console.log("Error: " + error);
        return response.status(400).send(error);
      }
      const drivefiles = res.data.files;
      if (drivefiles.length) {
        console.log("Google Drive Files:");
        drivefiles.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("There are no file.");
      }
      response.send(drivefiles);
    }
  );
});

application.post("/retrieveacconutinfo", (request, response) => {
  token = request.body.token;
  if (token == null) return response.status(400).send("Cannot Find the Token");
  client.setCredentials(token);

  const oauth = google.oauth2({ version: "v2", auth: client });
  oauth.userinfo.get((error, res) => {
    if (error) response.status(400).send(error);
    console.log(res.data);
    response.send(res.data);
  });
});

application.post('/retrieveacconutinfo', (request, response) => {
    token = request.body.token;
    if (token == null) return response.status(400).send('Cannot Find the Token');
    client.setCredentials(token);

    retiveAccountInfo().then(accountInfoData => response.send(accountInfoData));
});

/* TO DO: Break the fucntion into 2
async function retiveAccountInfo() {
    const oauth = google.oauth2({ version: 'v2', auth: client });
    const result = oauth.userinfo.get(async (error, response) => {
        if (error) response.status(400).send(error);
        console.log(response.data);
        result = await response.data; 
    })
    return result;
  }


application.post("/getaccesstoken", (request, response) => {
  code = request.body.code;
  if (code == null) return response.status(400).send("Request is Invalid");
  client.getToken(code, (error, acessToken) => {
    if (error) {
      console.error("Error. Access Token cannot be Retreived.", error);
      return response
        .status(400)
        .send("Error. Access Token cannot be Retreived.");
    }
    response.send(acessToken);
  });
});
*/

application.get("/getauthorizationurl", (request, response) => {
  const authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
  });
  console.log(authorizationUrl);
  return response.send(authorizationUrl);
});

application.get("/", (req, res) =>
  res.send("Sri file upload backend runnning")
);

const PORT = process.env.PORT || 7000;
application.listen(PORT, () => console.log(`Server has Started ${PORT}`));
