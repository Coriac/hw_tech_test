require('dotenv').config();
const axios = require('axios');
const { lastJobDate } = require('./jobService');
const { ftDateFormat } = require('../utils/dateFormat');
const { PE_CLIENT_ID, PE_CLIENT_SECRET } = require('../config/env');
const { TOKEN_URL, SEARCH_OFFRE_URL, SCOPE } = require('../config/constants');

let accessToken = null;

/**
 * Retrieves a new access token if the current one is expired.
 * @returns {Promise<Object>} The Pôle Emploi API response enriched with an expiration date.
 */
async function getAccessToken() {
  try {
    // Token still available
    if (
      accessToken &&
      accessToken.expiration_date &&
      Date.now() < accessToken.expiration_date
    ) {
      return accessToken;
    }

    const params = {
      grant_type: 'client_credentials',
      client_id: PE_CLIENT_ID,
      client_secret: PE_CLIENT_SECRET,
      scope: SCOPE,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await axios.post(TOKEN_URL, params, {
      headers,
    });

    response.data.expiration_date =
      Date.now() + response.data.expires_in * 1000;

    console.log(
      '✅ Token :',
      response.data.access_token,
      new Date(response.data.expiration_date)
    );
    return response.data || {};
  } catch (error) {
    if (error.response) {
      console.log(
        `❌ Erreur API Pôle Emploi : ${error.response?.status} ${
          error.response?.statusText
        } ${JSON.stringify(error.response?.data)}`
      );
    }
    throw error;
  }
}

/**
 * Calls the Pôle Emploi API with specific filters.
 * @param {Object} options
 * @param {string} options.inseeCommune - Filter job offers by commune (INSEE code)
 * @param {number} options.page - Pagination page number
 * @param {Date} options.minCreationDate - Minimum creation date of job offers
 * @param {Date} options.maxCreationDate - Maximum creation date of job offers
 * @returns {Promise<Generator<any[], any, any>>} The Axios response
 */
async function getOffers({
  inseeCommune,
  page = 0,
  minCreationDate,
  maxCreationDate,
}) {
  try {
    accessToken = await getAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken.access_token}`,
      Accept: 'application/json',
    };

    const params = {
      sort: '1', // Sorting by date. This is a way to avoid already saved Jobs and also to avoid the page limitation
    };

    if (inseeCommune) {
      params.commune = inseeCommune;
      params.distance = 0;
    }
    if (page) params.range = `${page * 150}-${(page + 1) * 150 - 1}`;
    if (minCreationDate) params.minCreationDate = ftDateFormat(minCreationDate);
    if (maxCreationDate) params.maxCreationDate = ftDateFormat(maxCreationDate);

    const config = {
      params,
      headers,
    };

    return await axios.get(SEARCH_OFFRE_URL, config);
  } catch (error) {
    if (error.response) {
      console.log(
        `❌ Erreur API Pôle Emploi : ${error.response?.status} ${
          error?.statusText
        } ${JSON.stringify(error.response?.data)}`
      );
    }
    throw error;
  }
}

/**
 * Fetches all job offers for a specific commune.
 * @param {string} inseeCommune - Filters job offers by commune (INSEE code).
 * @returns {AsyncGenerator<Object[]>} Job offers returned by the Pôle Emploi job search API.
 */
async function* fetchOffersForCommunes(inseeCommunes) {
  try {
    if (
      !accessToken ||
      !accessToken.expiration_date ||
      accessToken.expiration_date > Date.now()
    ) {
      accessToken = await getAccessToken();
    }

    for (const inseeCommune of inseeCommunes) {
      const minCreationDate = await lastJobDate(inseeCommune);

      let maxCreationDate = new Date();
      let response = {};

      do {
        console.log(
          `poleEmploiService : Fetching commune ${inseeCommune}... Date between ${minCreationDate.toLocaleString(
            'fr-FR'
          )} : ${maxCreationDate.toLocaleString('fr-FR')}.`
        );
        response = await getOffers({
          inseeCommune,
          minCreationDate,
          maxCreationDate,
        });

        console.log(
          `poleEmploiService : ✅ Found ${response?.data?.resultats.length} offers !`
        );

        if (response?.data?.resultats) {
          yield response?.data?.resultats;
        }

        const newMaxCreationDate = new Date(
          response?.data?.resultats[
            response?.data?.resultats.length - 1
          ].dateCreation
        );

        if (maxCreationDate === newMaxCreationDate) {
          console.log(`⚠️ ${JSON.stringify(response?.data?.resultats)}`);
          // Troubleshooting : sometimes the API gives us the exact same creationDate as last job
          maxCreationDate.setMinutes(maxCreationDate.getMinutes() + 1);
        } else {
          maxCreationDate = newMaxCreationDate;
        }
      } while (response?.status === 206);
    }
    console.log(`poleEmploiService : ✅ Reached last page !`);
  } catch (error) {
    if (error.response) {
      console.log(
        `❌ Erreur API Pôle Emploi : ${error.response?.status} ${
          error?.statusText
        } ${JSON.stringify(error.response?.data)}`
      );
    }
    console.log(error);
    throw error;
  }
}

module.exports = {
  fetchOffersForCommunes,
};
