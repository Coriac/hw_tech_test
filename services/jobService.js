const Job = require('../models/jobModel');

async function lastJobDate(communeInsee) {
  try {
    // Recherche le job le plus récent (par dateActualisation) pour la commune spécifiée
    const latestJob = await Job.findOne({ communeInsee: communeInsee })
      .sort({ dateCreation: -1 }) // Trie par dateActualisation décroissante
      .select('dateCreation') // Sélectionne uniquement la dateActualisation
      .exec();

    return new Date(latestJob ? latestJob.dateCreation : 0);
  } catch (error) {}
}

// Fonction pour enregistrer les offres sans doublon
async function storeOffers(offers) {
  // console.log(`storeOffers: ${offers.length}`);
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
  return newOffersCount; // Retourner le nombre d’offres ajoutées
}

// Fonction pour générer des statistiques sur les offres
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
