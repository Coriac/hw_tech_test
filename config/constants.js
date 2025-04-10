const TOKEN_URL =
  'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire';
const SERVER_URL = 'https://api.francetravail.io/partenaire/offresdemploi';
const SEARCH_OFFRE_URL = SERVER_URL + '/v2/offres/search';
const SCOPE = 'api_offresdemploiv2 o2dsoffre';
const INSEE_COMMUNES = [
  '35238', // Rennes
  '33063', // Bordeaux
  '75101', // Paris
  '75102',
  '75103',
  '75104',
  '75105',
  '75106',
  '75107',
  '75108',
  '75109',
  '75110',
  '75111',
  '75112',
  '75113',
  '75114',
  '75115',
  '75116',
  '75117',
  '75118',
  '75119',
  '75120',
];

module.exports = {
  TOKEN_URL,
  SEARCH_OFFRE_URL,
  SCOPE,
  INSEE_COMMUNES,
};
