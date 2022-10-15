'use strict';

module.exports = (helper) => {

  /**
   * Find documents
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, model) => {
    return new Promise(async (resolve, reject) => {
      const params = {
        query: {},
        page: req.query._page || 0,
        perPage: req.query._perPage || 0
      };

      if (req.query._filters) params.query = JSON.parse(req.query._filters);
      if (req.query._select) params.select = JSON.parse(req.query._select);
      if (req.query._populates) params.populates = JSON.parse(req.query._populates);
      if (req.query._sort) params.sort = JSON.parse(req.query._sort);

      if (req.filters) params.query = { ...params.query, ...req.filters };

      const result = await global.helpers.databaseUtils.find(params, model)
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      resolve(result);
    });
  };
};
