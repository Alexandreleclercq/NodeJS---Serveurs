/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]?[query string]

  Par exemple :
   - Protocole : http
   - Adresse IP : 192.168.104.15
   - Port : 80
   - Ressource : /formulaire.html
   - Query String : date=2015-09-01

   Donne l'URL : http://192.168.104.15:80/formulaire.html?date=2015-09-01
**/

/**
  Exercices :

  1. Pour cet exercice vous reprendrez le serveur HTTP de l'exercice précédent.

  Créez un fichier HTML dans lequel se trouvera un formulaire de saisie.

  Ce formulaire à pour attributs :
  - method="GET"
  - action="http://[adresse IP ou nom de domaine de votre serveur][:port de votre serveur]/traitement.html"

  Ce formulaire contient 4 champs :
  - titre avec pour attribut name="titre";
  - descriptif avec pour attribut name="descriptif";
  - date avec pour attribut name="date";
  - un bouton de soumission.

  Vérifiez que lorsque vous soumettez votre formulaire, votre navigateur Internet produit bien une requête HTTP dont l'URL est de la forme : http://[adresse IP ou nom de domaine de votre serveur][:port de votre serveur]/traitement.html?titre=&descriptif=&date=
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
  let title = searchParams.get('title');
  let description = searchParams.get('description');
  let currentDate = searchParams.get('date');
  let content;
  let defaultType = 'text/html;charset=utf8';

  let queryString = path.parse(req.url).base.split('?')[1];
  let fileName = path.parse(req.url).name;
  let fileType = url.pathname.replace(`/${fileName}`, '');

  let contentType = extTypes[fileType];
  let statusCode = 200;
  let userPath = `${__dirname}/html/${url.pathname}`;
  const replText = {
    '{#dateOfDay}': currentDate,
    '{#title}': title,
    '{#description}': description,
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
    if (queryString && title && description && currentDate) {
      for (property in replText) {
        data = data.toString().replace(property, replText[property])
      };
    } else {
      data = Buffer.from(`<p>Merci de bien vouloir vous enregistrer pour bénéficier de tous nos services !</p>`);
    };
    res.statusCode = statusCode;
    res.content = data;
    res.contentType = contentType;
    sendResponse(res);
  })
})
server.listen(46971, () => console.log('Listening on port: 46971'));
/**
  2.

  Créez un fichier HTML traitement.html dans lequel vous positionnerez trois chaînes de caractères
  facilement reconnaissable. Par exemple :
  - {{ titre }}
  - {{ description }}
  - {{ date }}

  Après avoir lu et obtenu le contenu du fichier traitement.html et avant de retourner la réponse HTTP,
  votre serveur HTTP doit remplacer dans le contenu du fichier les 3 chaînes de caractères par, respectivement, le titre, la description et la date provenant du Query String contenu dans la requête HTTP.
**/