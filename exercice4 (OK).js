/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]

  Par exemple :
   - Protocole : http
   - Adresse IP : 31.42.53.64
   - Port : 5555
   - Ressource : /accueil

   Donne l'URL : http://31.42.53.64:5555/home
**/

/**
  Exercices :
    
  1. Créez deux fichiers HTML valides : home.html et about.html

  Vous devez créer un serveur HTTP qui retourne dans sa réponse HTTP
  - le contenu du fichier home.html si l'URL utilisé pour effectuer la requête HTTP contient la ressource /accueil
  - le contenu du fichier about.html si l'URL utilisé pour effectuer la requête HTTP contient la ressource /apropos
**/
const http = require('http')
const fs = require('fs');
const myServer = http.createServer();

function sendResponse(response) {
  response.writeHead(response.statusCode, {
    'Content-Type': 'text/html;charset=utf8',
    'Content-Length': response.content.length,
  })
  response.write(response.content, () => response.end())
}

myServer.on('request', (req, res) => {
  let content;
  let statusCode = 200;
  const myURL = new URL(req.url, `http://${req.headers.host}`);

  if (myURL.pathname === "/accueil") {
    fs.readFile('./html/home.html', (err, data) => {
      if (err) {
        res.statusCode = 404;
        data = Buffer.from('Fichier introuvable.')
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  } else if (myURL.pathname === "/apropos") {
    fs.readFile('./html/about.html', (err, data) => {
      if (err) {
        res.statusCode = 404;
        data = Buffer.from('Fichier introuvable.');
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  } else {
    fs.readFile('./html/404.html', (err, data) => {
      if (err) {
        res.statusCode = 404;
        data = Buffer.from('Fichier introuvable.');
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  }
})

myServer.listen(3366);
/**
  Exercices :

  2. Créez un fichier HTML valide : 404.html

  Votre serveur HTTP doit retourner dans sa réponse HTTP le contenu du fichier 404.html si l'URL utilisé pour effectuer la requête HTTP ne contient pas la ressource /accueil ou /apropos. N'oubliez pas de préciser le code 404 dans les en-têtes de la réponse HTTP.
**/