
const express = require('express');
const cors = require('cors');
var https = require('https');
var http = require('http');
const fs = require('fs');

const {SERVER_PORT, SERVER_HOSTNAME, AMBIENTE, SERVER_PORT_HTTPS, PKDIR, CERTDIR, CADIR } = require('./config');
const { GetLocation } = require('./js/LocalizationManager');
const app = express();
app.use(cors())

//Inicializamos servidor http
const httpServer = http.createServer(app);

httpServer.listen(SERVER_PORT,SERVER_HOSTNAME,() => {
  console.log(`Server http running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`);
  

});

//Buscamos datos para credenciales https
const pkDir=PKDIR;
const certDir=CERTDIR;
const caDir =CADIR;

//Si se encuentran los archivos de credenciales
if (fs.existsSync(pkDir) && fs.existsSync(certDir) && fs.existsSync(caDir)){
  const privateKey = fs.readFileSync(pkDir, 'utf8');
  const certificate = fs.readFileSync(certDir, 'utf8');
  const ca = fs.readFileSync(caDir, 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  
  //Inicializamos servidor https
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(SERVER_PORT_HTTPS,SERVER_HOSTNAME, () => {
    console.log(`Server https running at https://${SERVER_HOSTNAME}:${SERVER_PORT_HTTPS}/`);
  });
}
else{   //faltan archivos de credenciales
  console.log("No se pudo inicializar el servidor https ya que faltan credenciales");
}

console.log("Ambiente: "+ AMBIENTE);


app.get("/welcome", (req, res) => {

    res.status(200).send("Bienvenido!");
})

app.post("/topsecret", (req, res) => {

    var position = GetLocation(1);
    var response = 
    {
        position:position,
        message: "este es un mensaje secreto",

    }


    res.status(200).json(response);
})