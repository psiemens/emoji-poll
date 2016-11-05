module.exports = {
  home: function(req, res) {
    return res.send({data: 'TEST'});
  },
  incoming: function(req, res) {
    console.log(req.body);
    return res.send({data: 'TEST'});
  }
}
