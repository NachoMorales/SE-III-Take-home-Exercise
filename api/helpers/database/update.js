'use strict';

module.exports = (helper) => {

  /**
   * Update document
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, model) => {
    return new Promise(async (resolve, reject) => {
      const data = await model.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      if (!data) reject(helper.lib.httpError(404, 'No se encontró la entidad'));

      resolve({ data });
    });
  };
};
