var request = require('request');

exports.index = function(req, res){
  res.render('index', { title: 'Tianyu & Jeff Wedding Site' });
};

exports.guest = function(req, res){
  var options = {
    url: 'https://b72b7c5f-0ef2-42c9-abf0-600e62caed60-bluemix:baae308e9cafe729ca8a0d6545cce00ecb6b5cc11ed9d1ecf940dbe3116a6566@b72b7c5f-0ef2-42c9-abf0-600e62caed60-bluemix.cloudant.com/guest_list/_all_docs?include_docs=true',
    method: 'GET',
    Key: 'plaralsoutoodeathenterst',
    Password: 'ba0b40fc5d95fa98f466ea5f1a7f1bd27a2a652e'

  };
  request(options, (error, response, body) => {
    if (!error) {
      console.log(response.statusCode);
      console.log(body);
      var guests = JSON.parse(body);
      res.render('guest-rsvp-list', { guests: guests});
    }
  });

  // res.render('guest-rsvp-list', { test: 'lala' });
};
