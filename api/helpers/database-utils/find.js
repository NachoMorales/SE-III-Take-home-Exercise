'use strict';

module.exports = (helper) => {

  /**
   * Find documents
   *
   * @param {Object} params - Parameters
   * @param {Object} model - Model
   * @return {Promise}
   */
  return (params, model) => {
    return new Promise(async (resolve, reject) => {
      let itemsPerPage = parseInt(params.perPage) || helper.settings.database.itemsPerPage;
      let page = 0;

      if (params.page && params.page > 0) page = parseInt(params.page) - 1;
      else itemsPerPage = 0;

      const data = await model.find(params.query || {})
        .select(params.select || {})
        .populate(params.populates || [])
        .sort(params.sort || {})
        .limit(itemsPerPage)
        .skip(itemsPerPage * page)
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      const count = await model.countDocuments(params.query)
        .catch(error => reject(helper.lib.httpError(400, error.message || 'Ocurrió un error inesperado')));

      const result = {
        data,
        count,
        page: page + 1,
        pages: itemsPerPage ? Math.ceil(count / itemsPerPage) : 1,
        itemsPerPage: itemsPerPage || count
      };

      resolve(result);
    });
  };
};
