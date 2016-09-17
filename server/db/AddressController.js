module.exports = (db, Sequelize, User) => {

  //  Initializes user table. Currently only has email, can also have phone/additional Facebook information.

  var Address = db.define('address', {

    name: Sequelize.STRING,
    addressLine1: Sequelize.STRING,
    addressLine2: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    zip: Sequelize.STRING,
    country: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    stripeDateCreated: Sequelize.STRING,
    stripeId: Sequelize.STRING,
    amount: Sequelize.STRING
    
  });

  //  PSEUDO-IMPLEMENTED. Updates the user's information. However, not many fields can be changed...
  //  Only email at the moment. Feel free to add/remove fields and change facebook information.
  
  var stripe = require("stripe")("sk_test_kctqJ5uj3zZEU4tZsesRYreu");

  // post request for user purchase
  const postAddress = (req, res, next) => {
    var token = req.body.token.id;
    Address.create({
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      phoneNumber: req.body.phoneNumber,
      stripeDateCreated: req.body.stripeDateCreated,
      stripeId: req.body.stripeId,
      amount: req.body.amount
    }).then(address => {
      User.find({where: {id: req.body.id}})
      .then(user => {
        user.addAddresses(address)
        .then(posted => {
          var charge = stripe.charges.create({
            amount: Number(req.body.amount),
            currency: 'usd',
            source: token,
            description: 'Example charge'
            }).then((err, charge) => {
              if (err && err.type === 'StripeCardError') {
                console.log('The card has been declined');
              } else {
                console.log('The payment was processed');
              }
            });
            res.send(posted);
          });
        });
    });
  };

  // const sendToStripe = (req, res, next) => {
  //   console.log(req)
  //   var token = req.body.stripeToken; // Using Express

  //   // Create a charge: this will charge the user's card
  //   var charge = stripe.charges.create({
  //     amount: 1000, // Amount in cents
  //     currency: "usd",
  //     source: token,
  //     description: "Example charge"
  //   }, function(err, charge) {
  //     if (err && err.type === 'StripeCardError') {
  //       // The card has been declined
  //     }
  //   });
  // };

  return {
    Address: Address,
    postAddress: postAddress
  };
};