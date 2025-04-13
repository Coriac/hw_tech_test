const Job = require('../models/jobModel');

/**
 * Retrieves the most recent creation date of job offers
 * for a given municipality.
 * @param {string} communeInsee - The INSEE code of the municipality.
 * @returns {Promise<Date>} The date of the most recent job or `new Date(0)` if none.
 */
async function lastJobDate(communeInsee) {
  try {
    // Looking for the most recent job (sadly not dateActualisation as the API doesn't permit to filter with this parameter) for a specific commune
    const latestJob = await Job.findOne({ communeInsee: communeInsee })
      .sort({ dateCreation: -1 })
      .select('dateCreation')
      .exec();

    return new Date(latestJob ? latestJob.dateCreation : 0);
  } catch (error) {}
}

/**
 * Saves a list of job offers to the database if they are not already present.
 * @param {Array<Object>} offers - List of job offers.
 * @returns {Promise<number>} The number of offers added.
 */
async function storeOffers(offers) {
  let newOffersCount = 0;
  for (const job of offers) {
    const exists = await Job.findOne({ externalId: job.id });
    if (!exists) {
      const newJob = new Job({
        externalId: job.id,
        intitule: job?.intitule,
        description: job?.description,
        dateCreation: job?.dateCreation,
        dateActualisation: job?.dateActualisation,
        lieuTravail: job?.lieuTravail?.libelle,
        communeInsee: job?.lieuTravail?.commune,
        romeCode: job?.romeCode,
        romeLibelle: job?.romeLibelle,
        appellationlibelle: job?.appellationlibelle,
        entreprise: job?.entreprise?.nom,
        typeContrat: job?.typeContrat,
        typeContratLibelle: job?.typeContratLibelle,
        natureContrat: job?.natureContrat,
        experienceExige: job?.experienceExige,
        experienceLibelle: job?.experienceLibelle,
        salaireLibelle: job?.salaire?.libelle,
        salaireComplement1: job?.salaire?.complement1,
        salaireComplement2: job?.salaire?.complement2,
        dureeTravailLibelle: job?.dureeTravailLibelle,
        dureeTravailLibelleConverti: job?.dureeTravailLibelleConverti,
        alternance: job?.alternance,
        secteurActivite: job?.secteurActivite,
        secteurActiviteLibelle: job?.secteurActiviteLibelle,
        urlOrigine: job?.origineOffre?.urlOrigine,
        pays: 'France',
      });
      await newJob.save();
      newOffersCount++;
    }
  }
  console.log(`jobService        : ✅ Saved ${newOffersCount} new offers !`);
  return newOffersCount;
}

/**
 * Generates aggregated statistics on the stored job offers.
 * @returns {Promise<Object>} An object containing various statistics.
 */
async function generateStats() {
  const totalJobs = await Job.countDocuments();

  const contractStats = await Job.aggregate([
    { $group: { _id: '$typeContrat', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const companyStats = await Job.aggregate([
    { $group: { _id: '$entreprise', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const countryStats = await Job.aggregate([
    { $group: { _id: '$pays', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const communeStats = await Job.aggregate([
    { $group: { _id: '$communeInsee', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    totalJobs,
    contractStats,
    companyStats,
    countryStats,
    communeStats,
  };
}

module.exports = {
  storeOffers,
  generateStats,
  lastJobDate,
};
