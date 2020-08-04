/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port]

  Par exemple :
   - Protocole : http
   - Adresse IP : 1.2.3.4
   - Port : 7777

   Donne l'URL : http://1.2.3.4:7777
**/

/**
  Exercices :

  1. Vous devez créer un serveur HTTP qui retourne dans sa réponse HTTP un corps de réponse en format HTML obtenu à partir du contenu d'un fichier. Vous devez donc créer un fichier HTML valide à coté de votre programme.

  A chaque requête HTTP reçue, vous utiliserez les méthodes asynchrones de l'objet FileSystem de Node JS pour lire et obtenir le contenu de votre fichier HTML. Puis, vous produirez une réponse HTTP contenant le contenu du fichier HTML.
**/
const http = require('http');
const fs = require('fs');
const myServer = http.createServer();
let statusCode = 200;

myServer.on('request', (req, res) => {
  fs.readFile('index.html', (err, data) => {
    let content = data;
    if (err) {
      statusCode = 500;
      content = Buffer.from('Erreur, fichier introuvable.');
    }
    res.writeHead(statusCode,
      {
        'Content-Length': content.length,
        'Content-Type': 'text/html;charset=utf8',
      }
    )
    res.write(content, () => {
      res.end();
    })
  })
});

myServer.listen(46813);
