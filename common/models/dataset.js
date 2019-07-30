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
    essURI + "?fields=" + encodedFields + "&limits=" + encodedLimits;
  return finalURI;
}

async function CERICrequest(queryObject) {
  let results = [];
  if (typeof queryObject === Object) {
    results = [];
  }
  return results;
}

async function ELIrequest(queryObject) {
  let results = [];
  if (typeof queryObject === Object) {
    results = [];
  }
  return results;
}

async function ESRFrequest(queryObject) {
  let results = [];
  if (typeof queryObject === Object) {
    results = [];
  }
  return results;
}

async function ILLrequest(queryObject) {
  let results = [];
  if (typeof queryObject === Object) {
    results = [];
  }
  return results;
}

async function XFELrequest(queryObject) {
  let results = [];
  if (typeof queryObject === Object) {
    results = [];
  }
  return results;
}

function helper_translate(object, newobject, key) {
  if (object.hasOwnProperty(key)) {
    newobject[key] = object[key];
  }
  return;
}

function renameProperty(object, newobject, key, newkey) {
  if (object.hasOwnProperty(key)) {
    newobject[newkey] = object[key];
  }
  return;
}

async function translate(array_input) {
  // console.log(array1)
  const array1 = JSON.parse(array_input);
  console.log("gm type:", typeof array1);
  const array2 = [];
  for (let i = 0; i < array1.length; i++) {
    const scicatDset = array1[i];
    let panoscDset = {};
    renameProperty(scicatDset, panoscDset, "datasetName", "name");
    helper_translate(scicatDset, panoscDset, "license");
    helper_translate(scicatDset, panoscDset, "owner");
    helper_translate(scicatDset, panoscDset, "orcidOfOwner");
    helper_translate(scicatDset, panoscDset, "contactEmail");
    helper_translate(scicatDset, panoscDset, "startDate");
    renameProperty(scicatDset, panoscDset, "endTime", "endDate");
    helper_translate(scicatDset, panoscDset, "size");
    renameProperty(scicatDset, panoscDset, "creationLocation", "location");
    renameProperty(scicatDset, panoscDset, "sourceFolder", "path");
    helper_translate(scicatDset, panoscDset, "technique");
    helper_translate(scicatDset, panoscDset, "sampleName");
    helper_translate(scicatDset, panoscDset, "chemicalFormula");
    helper_translate(scicatDset, panoscDset, "wavelength");
    array2.push(panoscDset);
  }
  return array2;
}

async function ESSrequest(queryObject) {
  var results;
  console.log("query object", queryObject);
  const essURI = "https://scicatapi.esss.dk/api/v3/Datasets/anonymousquery";
  const fields = { text: queryObject };
  console.log("ess query", queryObject);
  const limits = { limit: "1" };
  const finalURI = buildURI(essURI, fields, limits);
  console.log(finalURI);
  var searchOptions = {
    method: "GET",
    uri: finalURI
  };
  let response;
  let response2;
  try {
    response = await requestPromise(searchOptions);
    response2 = await translate(response);
    console.log("gm response 2", response2);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
  // loop through the response and translate to panosc format

  //console.log(response);
  return response2;
}

async function instituteSearch(instituteName, queryObject) {
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
      results = await ESSrequest(queryObject);
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
  // console.log(results);
  return results;
}

module.exports = function(Dataset) {
  /**
   * Query PaNOSC institutes for scientific metadata
   * @param {object} searchTerm Object containing one or more properties, e.g. wavelength, or text for full text search
   * @param {Function(Error, object)} callback
   */

  Dataset.query = async function(searchTerm, callback) {
    var queryResults = [];
    // var searchTerm = { text: "nmx" };
    if (searchTerm === undefined) {
      console.log("searchTerm undefined");
    }
    console.log("query", searchTerm);

    const institutes = ["CERIC", "ELI", "ESRF", "ESS", "ILL", "XFEL"];
    // send request to six institutes
    let inst = "ESS";
    const instResults = await instituteSearch(inst, searchTerm);
    //const esrfResults = instituteSearch(inst, searchTerm);
    // queryResults = JSON.parse(instResults);
    queryResults = instResults;
    // queryResults.concat

    // aggregate results and return to user

    callback(null, queryResults);
  };

  Dataset.remoteMethod("query", {
    accepts: [
      {
        arg: "searchTerm",
        type: "string",
        required: false,
        description:
          "Object containing one or more properties, e.g. wavelength, or text for full text search"
      }
    ],
    returns: [
      {
        arg: "queryResults",
        type: "object",
        root: true,
        description: "Array of objects from search results"
      }
    ],
    description: "Query PaNOSC institutes for scientific metadata",
    http: [
      {
        path: "/query",
        verb: "get"
      }
    ]
  });
};
