var Poll = require('../models/poll');

module.exports = {

  viewPoll: function(req, res) {
    return Poll.getBySlug(req.params.slug)
      .then(function(poll) {
        return res.render('polls/view', {poll: poll, formatPhoneNumber: formatPhoneNumber});
      });
  },

  viewMap: function(req, res) {
    return res.render('polls/map');
  }
}

function formatPhoneNumber(number) {
  return number.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3 $4');
}
