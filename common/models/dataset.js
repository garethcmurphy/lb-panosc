"use strict";

module.exports = function(Dataset) {
  /**
   * Query PaNOSC institutes for scientific metadata
   * @param {object} searchTerm Object containing one or more properties, e.g. wavelength, or text for full text search
   * @param {Function(Error, object)} callback
   */

  Dataset.query = function(searchTerm, callback) {
    let queryResults;
    // TODO
    // read institutes from file or fetch from mongodb

    // send request to six institutes

    // aggregate results and return to user

    callback(null, queryResults);
  };
};
