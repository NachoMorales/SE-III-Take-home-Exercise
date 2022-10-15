'use strict';

module.exports = (helper) => {

  /**
   * Delete document
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (req, model) => {
    return new Promise(async (resolve, reject) => {
      const data = await model.findOneAndRemove({ _id: req.params.id }, { useFindAndModify: false })
        .catch(error => { console.log(error); reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')) });

      if (!data) reject(helper.lib.httpError(404, 'No se encontró la entidad'));

      resolve({ data });
    });
  };
};
