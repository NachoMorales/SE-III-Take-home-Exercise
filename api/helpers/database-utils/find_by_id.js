'use strict';

module.exports = (helper) => {

  /**
   * Find document by id
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise(async (resolve, reject) => {
      const data = await model.findById(params.id)
        .select(params.select || {})
        .populate(params.populates || [])
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      if (!data) reject(helper.lib.httpError(404, 'No se encontró la entidad'));

      resolve(data);
    });
  };
};
