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
    stripeId: Sequelize.STRING
    
  });

  //  PSEUDO-IMPLEMENTED. Updates the user's information. However, not many fields can be changed...
  //  Only email at the moment. Feel free to add/remove fields and change facebook information.

  // post request for user purchase
  const postAddress = (req, res, next) => {
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
      stripeId: req.body.stripeId
    }).then(address => {
      User.find({where: {id: req.body.id}})
      .then(user => {
        user.addAddresses(address)
        .then(posted => res.send(posted));
      });
    });
  };

  return {
    Address: Address,
    postAddress: postAddress
  };
};