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
      var guests = JSON.parse(body);
      var total = {
        guests: 0,
        kids: 0,
        Beef: 0,
        fish: 0,
        veggie: 0
      }

      guests.rows.map(function(guest) {
        var guestData = guest.doc;
        if (guestData.attending == 'accept') {
          total.guests += 1;
          total.kids += parseInt(guestData.kids);
          total[guestData.entree] += 1;
          if (guestData.extraGuest && guestData.extraGuest.length > 0){
            console.log(guestData.extraGuest.length);
            total.guests += guestData.extraGuest.length;
            guestData.extraGuest.map(function(xguest) {
              total[xguest.entree] += 1;
            })
          }
        }
      })

      res.render('guest-rsvp-list', { guests: guests, total: total});
    }
  });

  // res.render('guest-rsvp-list', { test: 'lala' });
};
