const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  externalId: { type: String, unique: true },
  intitule: String,
  description: String,
  dateCreation: Date,
  dateActualisation: Date,
  lieuTravail: String,
  communeInsee: String,
  romeCode: String,
  romeLibelle: String,
  appellationlibelle: String,
  entreprise: String,
  typeContrat: String,
  typeContratLibelle: String,
  natureContrat: String,
  experienceExige: String,
  experienceLibelle: String,
  salaireLibelle: String,
  salaireComplement1: String,
  salaireComplement2: String,
  dureeTravailLibelle: String,
  dureeTravailLibelleConverti: String,
  alternance: Boolean,
  secteurActivite: String,
  secteurActiviteLibelle: String,
  urlOrigine: String,
  pays: String,
});

module.exports = mongoose.model('Job', jobSchema);
