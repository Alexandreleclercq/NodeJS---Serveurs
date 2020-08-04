/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]

  Par exemple :
   - Protocole : http
   - Adresse IP : 10.2.1.0
   - Port : 4321
   - Ressource : /ville/paris.html

   Donne l'URL : http://10.2.1.0:4321/ville/paris.html
**/

/**
  Exercices :

  1. Pour cet exercice vous reprendrez le serveur HTTP de l'exercice précédent.

  Votre serveur HTTP doit gérer différents Mime Types. Vous devez faire en sorte que le Mime Type soit conforme à l'extension obtenue à partir de la ressource dans l'URL.

  Par exemple :
  - Si l'URL est http://10.2.1.0:4321/photo.jpeg (et que le fichier photo.jpeg existe)
  - Alors l'en-tête de la réponse HTTP doit contenir Content-Type : image/jpeg

  Vous devez gérer les Mime Types des formats de fichier suivants : css, js, jpeg, png, pdf, gif.

  La liste des Mime Types autorisés est disponible ici : http://www.iana.org/assignments/media-types/media-types.xhtml
**/


const http = require('http');
const myServer = http.createServer();
const fs = require('fs');
const path = require('path');

const extensionTypes = {
  '.css': 'text/css;charset=utf8',
  '.gif': 'image/gif',
  '.html': 'text/html;charset=utf8',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript;charset=utf8',
  '.json': 'application/json',
  '.mp3': 'audio/mp3',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
};

const sendResponse = response => {
  response.writeHead(response.statusCode, {
    'Content-Type': response.contentType,
    'Content-Length': response.content.length,
  });
  response.write(response.content, () => response.end());
};

myServer.on('request', (req, res) => {
  const myURL = new URL(req.url, `http://${req.headers.host}`);
  let fileExtension = path.extname(req.url);
  let contentType = extensionTypes[fileExtension];
  let defaultType = 'text/html;charset=utf8';
  let content;
  let statusCode = 200;

  // console.log(contentType);

  if (myURL.pathname != '/') {
    let userPath = `${__dirname}/projet-front-end/${myURL.pathname}`;
    fs.readFile(path.normalize(userPath), (err, data) => {
      if (err) {
        statusCode = 404;
        data = Buffer.from(`Une erreur ${statusCode}s'est produite. Message d'erreur: ${err.message}.`)
      }
      if (!contentType) {
        contentType = defaultType;
      }
      res.contentType = contentType;
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  } else {
    fs.readFile(`./html/404.html`, (err, data) => {
      if (err) {
        statusCode = 404;
        data = Buffer.from(`Une erreur ${statusCode}s'est produite. Message d'erreur: ${err.message}.`)
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    });
  }
});

myServer.listen(3368);

/**
  2. Utiliser votre serveur HTTP pour "servir" votre projet Front End (sur le réseau local).

  Pensez à utiliser l'onglet réseau des outils de développement de votre navigateur Internet pour
  vérifier que vous arrivez bien à télécharger toutes les ressources exigées par votre projet.

  Ajoutez la gestion des Mime Types manquants si nécessaire...
**/