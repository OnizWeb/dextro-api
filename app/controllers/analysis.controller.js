const db = require("../models");
const TRANSLATE = require("../translate/fr.json");
const User = db.user;
const Analysis = db.analysis;
const log = require("./log.controller.js");

/**
 * @module setAnalysis
 * @description Création d'une analyse
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne réponse 200
 */
exports.setAnalysis = (req, res) => {
  const body = req.body;
  if (!body.sample) {
    res.status(400).send({
      message: TRANSLATE.API.ANALYSIS.NEED_ELEMENT
    });
    return;
  }

  const id = req.params.id;

  User.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).send({
          message: TRANSLATE.API.ANALYSIS.USER_NOT_FOUND
        });
        return;
      }
      let arrayOfAnalysis = user.myAnalysis;
      const analysis = new Analysis({
        sample: body.sample,
        injection: body.injection,
        injectionDose: body.injection ? body.injectionDose : null,
        comment: body.comment ? body.comment : null,
        idUser: id
      });

      analysis.save()
        .then(data => {
          if (data) {
            arrayOfAnalysis.push(data._id);
            let updateUser = {
              myAnalysis: arrayOfAnalysis
            }
            User.findByIdAndUpdate(user.id, updateUser, { useFindAndModify: false })
              .then( () => {
                log.setLog("setAnalysis", "analysis.controller.js", user.id, true);
                res.status(200).send({ message: TRANSLATE.API.ANALYSIS.SET_SUCCESS });
              })
              .catch(err => {
                log.setLog("setAnalysis", "analysis.controller.js", user.id, false);
                res.status(503).send({ message: TRANSLATE.API.ANALYSIS.ADD_ANALYSIS_FAILED });
              });
          }
        })
        .catch(err => {
          log.setLog("setAnalysis", "analysis.controller.js", user.id, false);
          res.status(503).send({ message: TRANSLATE.API.ANALYSIS.ADD_ANALYSIS_FAILED });
        });
    })
    .catch(err => {
      log.setLog("setAnalysis", "analysis.controller.js", id, true);
      res.status(404).send({
        message: err.message || TRANSLATE.API.ANALYSIS.USER_FOUND_FAILED
      });
      return;
    });
};

/**
 * @module getAnalysis
 * @description récupération d'une analyse
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne une analyse
 */
exports.getAnalysis = (req, res) => {
  const id = req.params.id;

  Analysis.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: TRANSLATE.API.ANALYSIS.ANALYSIS_NOT_FOUND });
        return;
      }
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(503).send({ message: TRANSLATE.API.ANALYSIS.GET_ANALYSIS_FAILED});
    });
};

/**
 * @module getAllAnalysis
 * @description récupération de toutes les analyses (ADMIN)
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne un tableau d'analyses
 */
exports.getAllAnalysis = (req, res) => {
  const idUser = req.params.idUser;

  Analysis.find({ idUser: idUser })
    .then(data => {
      if (data && data.length > 0) {
        res.status(200).send(data);
      } else {
        res.status(404).send({ message: TRANSLATE.API.ANALYSIS.ALL_ANALYSIS_NOT_FOUND });
        return;
      }
    })
    .catch(err => {
      res.status(503).send({ message: TRANSLATE.API.ANALYSIS.GET_ALL_ANALYSIS_FAILED});
    });
};

/**
 * @module updateAnalysis
 * @description mise à jour d'une analyse
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne réponse 200
 */
exports.updateAnalysis = (req, res) => {

  log.setLog("updateAnalysis", "analysis.controller.js", "en attente de la fonction", true);
  res.status(200).send({ message: "A faire je sais!!!!!"});
};

/**
 * @module deleteAnalysis
 * @description suppression d'une analyse
 * @author Florian Hoel-Bacle <f.hoel-bacle@compethance.fr>
 * @param  {Object} req Récupération des paramètres envoyés
 * @param  {Object} res Réponse de la requête
 * @return {Object}     Retourne réponse 200
 */
exports.deleteAnalysis = (req, res) => {
  log.setLog("deleteAnalysis", "analysis.controller.js", "en attente de la fonction", true);
  res.status(200).send({ message: "A faire je sais!!!!!"});
};
