/**
  Utilisation du module http de Node JS pour créer un serveur http de plus en plus élaboré.

  Votre serveur devra être joignable à l'URL : [protocole]://[adresse IP ou nom de domaine][:port][/ressource]

  Par exemple :
   - Protocole : http
   - Adresse IP : 168.192.10.168
   - Port : 5678
   - Ressource : /index.html

   Donne l'URL : http://168.192.10.168:5678/index.html
**/
const http = require('http');
const myServer = http.createServer();
const fs = require('fs');
const path = require('path');

const sendResponse = function (response) {
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
  // console.log(myURL)
  if (myURL.pathname != '/') {
    let userPath = `${__dirname}/html/${myURL.pathname}.html`;
    fs.readFile(path.normalize(userPath), (err, data) => {
      if (err) {
        res.statusCode = 500;
        data = Buffer.from(`A l'intérieur de if (err)`)
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  } else {
    fs.readFile(`./html/404.html`, (err, data) => {
      if (err) {
        res.statusCode = 500;
        data = Buffer.from(`A l'intérieur de if (err)`)
      }
      res.content = data;
      res.statusCode = statusCode;
      sendResponse(res);
    })
  }
})

myServer.listen(3367);
/**
  Exercices :

  1. Créez un serveur HTTP qui retourne dans sa réponse HTTP le contenu du fichier dont le nom est le même que celui obtenu à partir de l'URL si ce fichier existe.

  Et, si le fichier n'existe pas le serveur HTTP retournera dans sa réponse HTTP le contenu du fichier 404.html que vous avez créé pour l'exercice précédent.

  Vous devrez donc reconstruire le chemin qui vous permettra d'ouvrir un fichier à partir de la ressource fournie dans l'URL.

  Par exemple, si l'URL est :
  - http://168.192.10.168:5678/html/contact.html (la ressource est donc /html/contact.html)
  Le serveur HTTP devra ouvrir et obtenir le contenu du fichier dont le chemin système est :
  - c:\diwjs\nodejs\app\html\contact.html (où c:\diwjs\nodejs\app\ est mon dossier de travail)

  Pour obtenir le chemin vers le dossier dans lequel votre serveur s'exécute, vous pouvez utiliser l'objet Process vu précédemment. Et pour faire en sorte que les slash soient corrects, vous pouvez utiliser le module path de Node JS et particulièrement sa méthode
  .normalize() . Documenté ici : https://nodejs.org/api/path.html#path_path_normalize_p
**/