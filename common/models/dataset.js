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

async function ELIrequest(queryObject) {
  const results = [];
  return results;
}

async function ESRFrequest(queryObject) {
  const results = [];
  return results;
}

async function ILLrequest(queryObject) {
  const results = [];
  return results;
}

async function XFELrequest(queryObject) {
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

function instituteSearch(instituteName, queryObject) {
  let results = [];
  switch (instituteName) {
    case "CERIC":
      results = CERICrequest(queryObject);
      break;
    case "ELI":
      results = ELIrequest(queryObject);
      break;
    case "ESRF":
      results = ESRFrequest(queryObject);
      break;
    case "ESS":
      results = ESSrequest(queryObject);
      break;
    case "ILL":
      results = ILLrequest(queryObject);
      break;
    case "XFEL":
      results = XFELrequest(queryObject);
      break;
    default:
      break;
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

    const institutes = ["CERIC", "ELI", "ESRF", "ESS", "ILL", "XFEL"];
    // send request to six institutes
    for (const inst in institutes) {
      const instResults = instituteSearch(inst, searchTerm);
      queryResults.concat(instResults);
    }

    // aggregate results and return to user

    callback(null, queryResults);
  };
};
