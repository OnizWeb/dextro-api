const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const ParameterAccount = db.parameterAccount;

const log = require("./log.controller.js");

/**
 * @module setParameterAccount
 * @description Création du protocol de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.setParameterAccount = (idUser) => {
  const parameterAccount = new ParameterAccount ({
    idUser: idUser,
    multiAccount: false,
    linkTo: [],
    advice: true,
    alert: false
  });

  parameterAccount.save(parameterAccount)
    .then(data => {
      log.setLog("setParameterAccount", "parameterAccount.controller.js", idUser, true);
      console.log('parameterAccount insert');
    })
    .catch(err => {
      log.setLog("setParameterAccount", "parameterAccount.controller.js", idUser, false);
      console.log("parameterAccount insert FAILED");
    });
}

/**
 * @module getParameterAccount
 * @description Récupération des paramètres de compte de l'utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  les paramètres mis à jour
 */
exports.getParameterAccount = (req, res) => {

  const idUser = req.params.idUser;

  ParameterAccount.findOne({idUser: idUser})
    .then(data => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message : TRANSLATE.API.PARAMETER_ACCOUNT.PARAMETER_ACCOUNT_NOT_FOUND });
      }
    })
    .catch(err => {
      res.status(500).send({ message : TRANSLATE.API.PARAMETER_ACCOUNT.ERROR_PARAMETER_ACCOUNT });
    });
}

/**
 * @module updateParameterAccount
 * @description met à jour les paramètres de compte d'un utilisateur
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {String} idUser id de l'utilisateur
 * @return                  ne retourne rien
 */
exports.updateParameterAccount = (req, res) => {

  if (!req.body) {
    res.status(405).send({ message : TRANSLATE.API.PARAMETER_ACCOUNT.EMPTY_UPDATE });
  }

  const id = req.params.id;

  Parameter.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (data) {
        log.setLog("updateParameterAccount", "parameterAccount.controller.js", data.idUser, true);
        res.status(200).send({
          message: TRANSLATE.API.PARAMETER_ACCOUNT.MODIFY_PARAMETER_ACCOUNT
        });
      } else {
        log.setLog("updateParameterAccount", "parameterAccount.controller.js", req.body.idUser, false);
        res.status(404).send({
          message: TRANSLATE.API.PARAMETER_ACCOUNT.MODIFY_PARAMETER_ACCOUNT_FAIL
        });
      }
    })
    .catch(err => {
      log.setLog("updateParameterAccount", "parameterAccount.controller.js", req.body.idUser, false);
      res.status(503).send({
        message: err.message || TRANSLATE.API.PARAMETER_ACCOUNT.UPDATE_FAIL
      });
    });
}
