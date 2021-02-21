const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const Parameter = db.parameter;

const log = require("./log.controller.js");

/**
 * @module setParameter
 * @description Création du protocol de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.setParameter = (idUser) => {
  const parameter = new Parameter ({
    idUser: idUser,
    sensor: null,
    fastPen: null,
    slowPen: null
  });

  parameter.save(parameter)
    .then(data => {
      log.setLog("setParameter", "parameter.controller.js", idUser, true);
      console.log('parameter insert');
    })
    .catch(err => {
      log.setLog("setParameter", "parameter.controller.js", idUser, false);
      console.log("parameter insert FAILED");
    });
}

/**
 * @module getParameter
 * @description Création du protocol de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.getParameter = (req, res) => {

  const idUser = req.params.idUser;

  Parameter.findOne({idUser: idUser})
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message : TRANSLATE.API.PARAMETER.PARAMETER_NOT_FOUND });
      }
    })
    .catch(err => {
      res.status(500).send({ message : TRANSLATE.API.PARAMETER.ERROR_PARAMETER });
    });
}

/**
 * @module updateParameter
 * @description met à jour les paramètres d'un utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.updateParameter = (req, res) => {

  if (!req.body) {
    res.status(405).send({ message : TRANSLATE.API.PARAMETER.EMPTY_UPDATE });
  }

  const id = req.params.id;

  Parameter.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("updateParameter", "parameter.controller.js", data.idUser, true);
        res.status(200).send({
          message: TRANSLATE.API.PARAMETER.MODIFY_PARAMETER
        });
      } else {
        log.setLog("updateParameter", "parameter.controller.js", req.body.idUser, false);
        res.status(404).send({
          message: TRANSLATE.API.PARAMETER.MODIFY_PARAMETER_FAIL
        });
      }
    })
    .catch(err => {
      log.setLog("updateParameter", "parameter.controller.js", req.body.idUser, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.PARAMETER.UPDATE_FAIL
      });
    });
}
