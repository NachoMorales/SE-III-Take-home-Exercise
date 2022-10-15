'use strict';

module.exports = (module) => {

  /**
   * Add member note
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.post('/:id/note', (req, res, next) => {

    req.body = { $push: { notes: req.body } };

    global.helpers.database.update(req, module.model)
      .then(response => res.send(response))
      .catch(next);
  });

  /**
   * Delete member note
   *
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @param {Object} next - Next
   * @return {void}
   */
  module.router.delete('/:id/note/:note', (req, res, next) => {

    req.body = { $pull: { notes: { _id: req.params.note } } };

    global.helpers.database.update(req, module.model)
      .then(response => res.send(response))
      .catch(next);
  });

};
