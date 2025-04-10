const { storeOffers } = require('../services/jobService');
const poleEmploiService = require('../services/poleEmploiService');
const { INSEE_COMMUNES } = require('../config/constants');

/**
 * Récupère les offres d'emploi pour Paris, Rennes et Bordeaux
 * en utilisant leur code INSEE respectif.
 */
async function fetchAndStoreJobs(req, res) {
  try {
    // Codes INSEE des villes ciblées
    let resultsIterator = await poleEmploiService.fetchOffersForCommunes(
      INSEE_COMMUNES
    );

    let results = await resultsIterator.next();
    let foundCount = 0;
    let savedCount = 0;

    while (!results.done) {
      foundCount += results.value.length;
      savedCount += await storeOffers(results.value);
      results = await resultsIterator.next();
    }

    res.status(200).json({
      message: 'Offres récupérées avec succès',
      totalFound: foundCount,
      totalSaved: savedCount,
      // data: results,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des offres',
      error: error.message,
    });
  }
}

module.exports = {
  fetchAndStoreJobs,
};
