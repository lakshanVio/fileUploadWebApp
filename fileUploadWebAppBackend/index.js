const express = require("express");
const application = express();
const bodyParser = require("body-parser");
var cors = require('cors');
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

application.use(cors({origin: '*'}));
application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());

application.post("/uploadfile", (request, response) => {
  let formData = new formidable.IncomingForm();
  formData.parse(request, (error, flds, fls) => {
    if (error) return response.status(400).send(error);
    const accessToken = JSON.parse(flds.token);
    if (accessToken == null)
      return response.status(400).send("Cannot Find the Token");
    client.setCredentials(accessToken);
    const googleDrive = google.drive({ version: "v3", auth: client });
    const metadata = {
      name: fls.file.name,
    };
    const media = {
      mimeType: fls.file.type,
      body: fs.createReadStream(fls.file.path),
    };
    googleDrive.files.create(
      {
        resource: metadata,
        media: media,
        fields: "id",
      },
      (error, fls) => {
        client.setCredentials(null);
        if (error) {
          response.status(400).send(error);
        } else {
          response.send("File Upload Successful");
        }
      }
    );
  });
});

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

application.get("/getauthorizationurl", (request, response) => {
  const authorizationUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
  });
  return response.send({"authurl": authorizationUrl});
});

application.get("/", (request, response) =>
  response.send("Sri file upload backend runnning")
);

const PORT = process.env.PORT || 7000;
application.listen(PORT, () => console.log(`Server has Started ${PORT}`));
