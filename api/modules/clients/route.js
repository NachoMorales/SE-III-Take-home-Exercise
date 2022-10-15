'use strict';

module.exports = (module) => {

  /**
   * Search by name or state
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.get('/search', (req, res, next) => {

    if (!req.query._search) return next({ message: "Falta el parámetro '_search'" });

    req.filters = {
      $or: [
        { name: { $regex: req.query._search, $options: 'i' } },
        { state: { $regex: req.query._search, $options: 'i' } }
      ]
    }

    global.helpers.database.find(req, module.model)
      .then(response => res.send(response))
      .catch(next);
  });

};
