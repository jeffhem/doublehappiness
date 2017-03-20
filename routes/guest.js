
/*
 * GET home page.
 */

exports.guest = function(req, res){
  res.render('guest-rsvp-list.ejs', { title: 'Cloudant Boiler Plate' });
};