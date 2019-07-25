"use strict";
var requestPromise = require("request-promise");

function stringEncode(fields) {
  const fieldString = JSON.stringify(fields);
  return encodeURIComponent(fieldString);
}

function buildURI(essURI, fields, limits) {
  const encodedFields = stringEncode(fields);
  const encodedLimits = stringEncode(limits);
  const finalURI =
    essURI + "?fields" + encodedFields + "&limits=" + encodedLimits;
  return finalURI;
}

async function CERICrequest(queryObject) {
  const results = [];
  return results;
}

async function ESSrequest(queryObject) {
  var results;
  const essURI = "https://scicatapi.esss.dk/api/v3/Datasets/fullquery";
  const fields = queryObject; 
  const limits = { limit: "3", order: "size ASC" };
  const finalURI = buildURI(essURI, fields, limits);
  var searchOptions = {
    method: "GET",
    uri: finalURI
  };
  try {
    const response = await requestPromise(searchOptions);
    console.log(response);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  return results;
}

module.exports = function(Dataset) {
  /**
   * Query PaNOSC institutes for scientific metadata
   * @param {object} searchTerm Object containing one or more properties, e.g. wavelength, or text for full text search
   * @param {Function(Error, object)} callback
   */

  Dataset.query = function(searchTerm, callback) {
    var queryResults;

    // send request to six institutes
    const cericResults = CERICrequest(searchTerm);
    queryResults.concat(cericResults);
    const essResults = ESSrequest(searchTerm);
    queryResults.concat(essResults);

    // aggregate results and return to user

    callback(null, queryResults);
  };
};
