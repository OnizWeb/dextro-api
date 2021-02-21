const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const Log = db.log;

/**
 * @module setLog
 * @description Création du protocol de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} action méthode utilisée
 * @param  {String} location fichier où l'action se passe
 * @param  {Boolean} success succès ou erreur
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.setLog = (action, location, idUser, success) => {
  const log = new Log({
    idUser: idUser,
    action: action,
    location: location,
    success: success
  });

  log.save(log)
    .then(data => {
      console.log("log ajouté");
    })
    .catch(err => {
      console.log("erreur de log: ", err.message);
    });
};
