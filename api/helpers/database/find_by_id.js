'use strict';

module.exports = (helper) => {

  /**
   * Find document by id
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, model) => {
    return new Promise(async (resolve, reject) => {

      const params = { id: req.params.id };

      if (req.query._populates) params.populates = JSON.parse(req.query._populates);
      if (req.query._select) params.select = JSON.parse(req.query._select);

      const data = await global.helpers.databaseUtils.findById(params, model)
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      resolve({ data });
    });
  };
};
