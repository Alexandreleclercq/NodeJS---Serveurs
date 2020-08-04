/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]

  Par exemple :
   - Protocole : http
   - Adresse IP : 212.121.212.45
   - Port : 8080
   - Ressource : /index.html

   Donne l'URL : http://212.121.212.45:8080/index.html
**/

/**
  Exercices :

  1. Pour cet exercice vous reprendrez le serveur HTTP de l'exercice précédent.

  Créez un fichier HTML dans lequel vous positionnerez une chaîne de caractères facilement reconnaissable. Par exemple :
  - ##dateDuJour##

  Après avoir lu et obtenu le contenu d'un fichier et avant de retourner sa réponse HTTP, votre serveur HTTP doit remplacer dans le contenu du fichier la chaîne de caractères par la date du jour.
**/
const http = require('http');
const server = http.createServer();
const fs = require('fs');
const path = require('path');

const extTypes = {
  '.html': 'text/html;charset=utf8',
  '.pdf': 'application/pdf',
  '.css': 'text/css',
  '.js': 'text/javascript;charset=utf8',
  '.mp3': 'audio/mp3',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
}

const sendResponse = response => {
  response.writeHead(response.statusCode, {
    'Content-Type': response.contentType,
    'Content-Length': response.content.length,
  });
  response.write(response.content, () => response.end());
};


server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = new URLSearchParams(url.searchParams);
  let date = new Date();
  let firstName = 'Alexandre';
  let lastName = 'Masson';
  let content;
  let defaultType = 'text/html;charset=utf8';
  let fileName = path.parse(req.url).name;
  let fileType = url.pathname.replace(`/${fileName}`, '');
  let contentType = extTypes[fileType];
  let statusCode = 200;
  let userPath = `${__dirname}/html/${url.pathname}`;
  const replText = {
    '{#fullDate}': date,
    '{#firstName}': firstName,
    '{#lastName}': lastName,
  };

  fs.readFile(path.normalize(userPath), (err, data) => {
    if (err) {
      statusCode = 404;
      contentType = defaultType;
      data = Buffer.from(`<p>Une erreur est survenue. Code erreur: ${err.message}.</p>`);
    }
    for (property in replText) {
      data = data.toString().replace(property, replText[property])
    };
    res.statusCode = statusCode;
    res.content = data;
    res.contentType = contentType;
    sendResponse(res);
  })
})
server.listen(46969, () => console.log('Listening on port: 46969'));
/**
 2. Pour cet exercice vous reprendrez le serveur HTTP de l'exercice précédent.

 Créez un fichier HTML dans lequel vous positionnerez deux autres chaînes de caractères facilement reconnaissable. Par exemple :
 - {{ nom }}
  - {{ prenom }}

  Après avoir lu et obtenu le contenu d'un fichier et avant de retourner sa réponse HTTP,
  votre serveur HTTP doit remplacer dans le contenu du fichier les deux chaînes de caractères par respectivement votre nom et votre prénom.
**/