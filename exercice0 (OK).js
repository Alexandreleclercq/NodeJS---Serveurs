/**
  Utilisation du module http de Node JS pour créer un serveur http.
**/

/**
  On récupère l'objet http à partir du module http de Node JS.
  Cet objet est documenté ici : https://nodejs.org/api/http.html
**/
var http = require('http');
//La variable http contient à présent un objet de type http

/**
  L'exécution de la méthode .createServer() de l'objet http nous retourne un objet de type http.Server.
  Cet objet est documenté ici : https://nodejs.org/api/http.html#http_class_http_server
**/
var httpServer = http.createServer();
//La variable httpServer contient à présent un objet de type http.Server
/**
  Les objets de type http.Server héritent des caractéristiques d'un objet de type EventEmitter. Donc les objets de type http.Server disposent également des propriétés et méthodes d'un objet de type EventEmitter. 
  Les objets de type EventEmitter sont documentés ici : https://nodejs.org/api/events.html#events_class_eventemitter.
  
  Quand un objet fourni par Node JS hérite des caractéristiques d'un objet de type EventEmitter, cela signifie qu'on peut lui associer un gestionnaire d'évènement (fonction qui sera exécutée si un évènement particulier survient) en utilisant la méthode .on(). Cette méthode est documentée ici : https://nodejs.org/api/events.html#events_emitter_on_event_listener
  
  Pour un objet de type http.Server, on dispose de plusieurs évènements connus. Nous allons utiliser l'évènement 'request'. Il est documenté ici : https://nodejs.org/api/http.html#http_event_request
  Cet évènement survient lorsqu'une requête HTTP est reçue pas le serveur.

  On pourra alors écrire : httpServer.on('request', gestionnaireEvenement); où 'request' est le nom de l'évènement et gestionnaireEvenement une fonction qui sera déclenchée quand l'évènement survient.
  
  Node JS fournit 2 paramètres au gestionnaire d'évènement de l'évènement 'request' :
  - un objet de type  http.IncomingMessage qui représente la requête HTTP.
  - un objet de type http.ServerResponse qui représente la réponse HTTP.

  On pourra alors écrire un gestionnaire d'évènement de la forme : function(x, y ){ ... } ou :
  - x sera un objet de type http.IncomingMessage.
  - y sera un objet de type http.ServerResponse.
**/

//Gestion de l'évènement 'request'
httpServer.on('request', function (requeteHTTP, reponseHTTP) {

  requeteHTTP;
  /**
    requeteHTTP contient un objet de type http.IncomingMessage. Il représente la requête HTTP reçue.
    Cet objet est document ici : https://nodejs.org/api/http.html#http_class_http_incomingmessage.
  **/

  reponseHTTP;
  /**
    reponseHTTP contient un objet de type http.ServerResponse. Il représente la réponse HTTP reçue.
    Cet objet est document ici : https://nodejs.org/api/http.html#http_class_http_serverresponse
  **/

  /**
    Ici lorsque notre serveur HTTP reçoit une requête il écrira dans le terminal local un message : 'ping'. Et lorsqu'il répond au client HTTP (le navigateur Internet), il enverra dans sa réponse un document en HTML contenant le texte 'pong'.
  **/

  //On écrit 'ping' dans le terminal local du serveur.
  console.log('ping');

  //On créé une variable qui contient le corps de la réponse.
  var corpsDeLaReponseHTTP = 'pong';

  /**
   L'en-tête de la réponse HTTP que nous voulons renvoyer au client HTTP est :
   HTTP/1.1 200 OK                   Protocole/Version Code Message
   Content-Type: text/plain          Type de contenu : MimeType (la liste est disponible ici : http://www.iana.org/assignments/media-types/media-types.xhtml)
   Content-Length: 4                 Longueur du contenu : Entier (ce nombre n'est pas le nombre de caractères mais le NOMBRE D'OCTETS (bytes) qui sont envoyés)

   Pour produire un en-tête de réponse HTTP valide on utilise la méthode .writeHead() de l'objet http.ServerResponse.
  **/
  reponseHTTP.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(corpsDeLaReponseHTTP, 'utf8')
  });

  /**
    Buffer est une fonction/objet documenté ici : https://nodejs.org/api/buffer.html.
    La méthode .byteLength() de Buffer permet de compter le nombre d'octets correspondant à une chaîne de caractères.
    
    Exemple :
    - 'e' compte pour 1 octet (byte)
    - 'é' compte pour 2 octets (bytes).
  **/

  /**
    Le corps de la réponse HTTP que nous voulons renvoyer au client HTTP est 'pong'. Pour produire un
    corps de réponse HTTP on utilise la méthode .write() de l'objet http.ServerResponse.

    Cette méthode prend en argument le corps de réponse HTTP à envoyer ainsi qu'une fonction (callback)
    qui sera déclenchée à la fin de l'envoi.
  **/
  reponseHTTP.write(corpsDeLaReponseHTTP, function () {
    /**
      Un fois le corps de la réponse écrit. On doit couper la connexion avec le client HTTP.
      On utilise la méthode .end() de l'objet http.ServerResponse pour effectuer cette opération.
    **/
    reponseHTTP.end();

  });
});

/**
  Notre serveur doit être associé à un numéro identifiant : un port logiciel et démarré.
  Pour effectuer cette opération, on utilise la méthode .listen() de notre objet de type http.Server.
  Ici le port logiciel choisi est 8888. Notre serveur sera donc joignable (une fois démarré) à
  l'adresse : http://[adresse IP ou nom de domaine]:8888
**/
httpServer.listen(8888);