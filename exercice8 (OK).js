/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]?[query string]

  Par exemple :
   - Protocole : http
   - Adresse IP : 18.17.19.20
   - Port : 6767
   - Ressource : /bonjour.html
   - Query String : nom=Bruce&prenom=Wayne

   Donne l'URL : http://212.121.212.45:6767/bonjour.html?nom=Bruce&prenom=Wayne
**/

/**
  Exercices :

  1. Pour cet exercice vous reprendrez le serveur HTTP de l'exercice précédent.

  Créez un fichier HTML dans lequel vous positionnerez deux autres chaînes de caractères facilement reconnaissable. Par exemple :
  - {{ nom }}
  - {{ prenom }}

  Après avoir lu et obtenu le contenu d'un fichier et avant de retourner sa réponse HTTP, votre serveur HTTP doit remplacer dans le contenu du fichier les deux chaînes de caractères par respectivement le nom et le prénom provenant du Query String.

  Pour extraire des données provenant d'un Query String contenu dans un URL, vous pouvez utiliser le module URL de Node JS. Ce module est documenté ici : https://nodejs.org/api/url.html
  Vous vous intéresserez particulièrement à la méthode .parse() qui vous permet d'obtenir les différentes partie d'une URL sous la forme d'un objet facilement exploitable en JavaScript.
**/

/**
  2. Votre programme ne doit pas planter si le Query String n'est pas fourni ou que les informations demandées n'y figurent pas.
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
  let firstName = searchParams.get('first');
  let lastName = searchParams.get('last');
  let content;
  let defaultType = 'text/html;charset=utf8';

  let queryString = path.parse(req.url).base.split('?')[1];
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

  // Tests:
  // console.log('path.extname(req.url): ', path.extname(req.url));
  // console.log('path.parse: ', path.parse(req.url));
  // console.log('contentType: ', contentType);
  // console.log('userPath: ', userPath);
  // console.log('url.pathname: ', url.pathname);
  // console.log('path.parse(req.url).name: ', path.parse(req.url).name);
  // console.log(path.parse(req.url).base.split('?')[1]);


  fs.readFile(path.normalize(userPath), (err, data) => {
    if (err) {
      statusCode = 404;
      contentType = defaultType;
      data = Buffer.from(`<p>Une erreur est survenue. Code erreur: ${err.message}.</p>`);
    }
    if (queryString && firstName && lastName) {
      for (property in replText) {
        data = data.toString().replace(property, replText[property])
      };
    } else {
      data = Buffer.from(`<p>Vous êtes dans le fichier home</p><p>Nous sommes aujourd'hui le ${date}.</p><p>Merci de bien vouloir vous enregistrer pour bénéficier de tous nos services !</p>`);
    };
    res.statusCode = statusCode;
    res.content = data;
    res.contentType = contentType;
    sendResponse(res);
  })
})
server.listen(46970, () => console.log('Listening on port: 46970'));