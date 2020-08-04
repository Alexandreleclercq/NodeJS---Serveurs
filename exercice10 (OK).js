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
  
  Modifiez le formulaire de l'exercice précédent en changeant :
  - method="GET" par method="POST"
  
  Vérifiez que lorsque vous soumettez votre formulaire, le Query String n'apparaît plus dans l'URL.
  **/
const http = require('http');
const server = http.createServer();
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

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
  let content;
  let defaultType = 'text/html;charset=utf8';
  let fileName = path.parse(req.url).name;
  let fileType = url.pathname.replace(`/${fileName}`, '');
  let contentType = extTypes[fileType];
  let statusCode = 200;
  let userPath = `${__dirname}/html/${url.pathname}`;

  // Tests:
  // console.log('path.extname(req.url): ', path.extname(req.url));
  // console.log('path.parse: ', path.parse(req.url));
  // console.log('contentType: ', contentType);
  // console.log('userPath: ', userPath);
  // console.log('url.pathname: ', url.pathname);
  // console.log('path.parse(req.url).name: ', path.parse(req.url).name);
  // console.log(path.parse(req.url).base.split('?')[1]);


  let queryString = '';
  req.on('data', (queryBits) => {
    queryString += queryBits;
  });

  req.on('end', () => {
    let title = querystring.parse(queryString)['title'];
    let description = querystring.parse(queryString)['description'];
    let currentDate = querystring.parse(queryString)['date'];
    const replText = {
      '{#dateOfDay}': currentDate,
      '{#title}': title,
      '{#description}': description,
    };
    console.log(queryString);
    console.log('parse de queryString', querystring.parse(queryString));
    console.log('title', title);
    console.log('description', description);
    console.log('currentDate', currentDate);

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
    });
  });
});

server.listen(46972, () => console.log('Listening on port: 46972'));
/************************************************************************************************************
  Lorsqu'on spécifie method="POST" sur un formulaire, le navigateur Internet produit des requêtes HTTP pour lesquelles le Query String n'apparaît plus dans l'URL et donc dans l'en-tête de la requête HTTP
  mais dans le corps de la requête HTTP. Illustration :

  Méthode GET :
                                        ______________
                                       |   En-têtes   |
                                       |   URL avec   |
                                       | Query String |
  Navigateur Internet --> Requête HTTP |   + autres   | --> Serveur HTTP
                                       |______________|
                                       |  Corps vide  |
                                       |______________|

  Méthode POST :
                                        ______________
                                       |   En-têtes   |
                                       |   URL avec   |
  Navigateur Internet --> Requête HTTP |   + autres   | --> Serveur HTTP
                                       |______________|
                                       |    Corps     |
                                       | Query String |
                                       |______________|

  Donc coté serveur, si on souhaite récupérer le Query String, il faut lire le corps de la requête HTTP.

  Quel est l'intérêt ? Un URL est limité à 2048 caractères. Le corps de la requête n'a pas de limite de taille.
******************************************************************************************************************/

/**
  2. Créez un fichier HTML traitement.html dans lequel vous positionnerez trois chaînes de caractères
  facilement reconnaissable. Par exemple :
  - {{ titre }}
  - {{ description }}
  - {{ date }}

  Après avoir lu et obtenu le contenu du fichier traitement.html et avant de retourner la réponse HTTP, votre serveur HTTP doit remplacer dans le contenu du fichier les 3 chaînes de caractères par, respectivement,
  le titre, la description et la date provenant du Query String contenu dans le CORPS de la requête HTTP.

  Pour récupérer le contenu du corps de la requête HTTP :

  L'objet de type http.IncomingMessage qui représente la requête HTTP hérite d'un objet de type ReadableStream documenté ici : https://nodejs.org/api/stream.html#stream_class_stream_readable. Et les objets de type ReadableStream héritent d'un objet de type EventEmitter.

  Un objet de type http.IncomingMessage possède donc les évènements 'data' et 'end' de l'objet ReadableStream.
  - 'data' : est l'évènement qui se déclenche une ou plusieurs fois au fur et à mesure que le serveur HTTP télécharge le corps de la requête envoyée par le navigateur Internet.
  - 'end' : est l'évènement qui se déclenche quand serveur HTTP à reçu la totalité du corps de la requête.

  Pour récupérer le Query String on doit donc utiliser l'évènement 'data' pour reconstruire progressivement le Query String et, à la fin du téléchargement du Query String, déclencher les instructions souhaitées.

  Exemple :

  ...
  var queryString = ''; //variable dans laquelle sera stocké progressivement le query string

  requeteHTTP.on('data', function(morceauDeQueryString){
    // Cette fonction est exécutée par Node JS à plusieurs reprises
    // avec, à chaque fois, en paramètre une partie du Query String
    // jusqu'à ce que la totalité des morceaux du Query String aient
    // été téléchargés.
    queryString += morceauDeQueryString;
  });

  requeteHTTP.on('end', function(){
    //Cette fonction est exécutée par Node JS une fois que
    //le corps de la requête à été totalement téléchargé.
    queryString; //Ici on peut considérer que la variable queryString contient le corps de la requête.

  });

  ...

  Pour découper facilement un Query String hors d'une URL, on peut utiliser le module Query String de Node JS documenté ici : https://nodejs.org/api/querystring.html et particulièrement sa méthode .parse()
**/