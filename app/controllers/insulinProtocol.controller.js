const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const InsulinProtocol = db.insulinProtocol;

const log = require("./log.controller.js");

/**
 * @module setInsulinProtocol
 * @description Création du protocol de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.setInsulinProtocol = (idUser) => {
  const insulinProtocol = new InsulinProtocol ({
    idUser: idUser,
    limits: [],
    stepDose: []
  });

  insulinProtocol.save(insulinProtocol)
    .then(data => {
      log.setLog("setInsulinProtocol", "insulinProtocol.controller.js", idUser, true);
      console.log('Protocol insert');
    })
    .catch(err => {
      log.setLog("setInsulinProtocol", "insulinProtocol.controller.js", idUser, false);
      console.log("Protocol insert FAILED");
    });
}

/**
 * @module getInsulinProtocol
 * @description récupération du protocol d'un utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.getInsulinProtocol = (req, res) => {

  const idUser = req.params.idUser;

  insulinProtocol.findOne({idUser: idUser})
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message : TRANSLATE.API.PROTOCOL.PROTOCOL_NOT_FOUND });
      }
    })
    .catch(err => {
      res.status(500).send({ message : TRANSLATE.API.PROTOCOL.ERROR_PROTOCOL });
    });
}

/**
 * @module updateInsulinProtocol
 * @description met à jour le protocole d'un utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.updateInsulinProtocol = (req, res) => {

  if (!req.body) {
    res.status(405).send({ message : TRANSLATE.API.PROTOCOL.EMPTY_UPDATE });
  }

  const id = req.params.id;

  InsulinProtocol.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("updateInsulinProtocol", "insulinProtocol.controller.js", data.idUser, true);
        res.status(200).send({
          message: TRANSLATE.API.PROTOCOL.MODIFY_PROTOCOL
        });
      } else {
        log.setLog("updateInsulinProtocol", "insulinProtocol.controller.js", req.body.idUser, false);
        res.status(404).send({
          message: TRANSLATE.API.PROTOCOL.MODIFY_PROTOCOL_FAIL
        });
      }
    })
    .catch(err => {
      log.setLog("updateInsulinProtocol", "insulinProtocol.controller.js", req.body.idUser, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.PROTOCOL.UPDATE_FAIL
      });
    });
}
