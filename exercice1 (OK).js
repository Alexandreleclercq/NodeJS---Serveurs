/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port]

  Par exemple :
   - Protocole : http
   - Adresse IP : 100.50.25.12
   - Port : 6666

   Donne l'URL : http://100.50.25.12:6666
**/

/**
  Exercices :

  1. Vous devez créer un serveur HTTP qui retourne dans sa réponse HTTP un corps de réponse en format HTML valide.
  Attention, vous devez pensez à retourner dans l'en-tête de votre réponse HTTP le Mime Type correct (pour le HTML,
  il s'agit du Mime Type text/html)
**/

let http = require('http');
let myServer = http.createServer();
myServer.on('request', (request, response) => {
  console.log(request.headers);

  let myResponse = Buffer.from("<h1>Ceci est la réponse de mon serveur</h1>.");

  response.writeHead(200, {
    'Content-type': 'text/html;charset=utf8',
    'Content-Length': myResponse.length,
  })

  response.write(myResponse, () => {
    response.end();
  })
})

myServer.listen(3333);