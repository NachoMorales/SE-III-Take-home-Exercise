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

    if (!req.query.q) return next({ message: "Falta el parámetro 'q'" });

    req.filters = {
      $or: [
        { name: { $regex: req.query.q, $options: 'i' } },
        { state: { $regex: req.query.q, $options: 'i' } }
      ]
    }

    global.helpers.database.find(req, module.model)
      .then(response => res.send(response))
      .catch(next);
  });

};
