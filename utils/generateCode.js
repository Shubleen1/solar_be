const User = require('../models/User');

/*
  Generates a unique referral code like  RAHUL-X7K2
  - Takes first 5 letters of name
  - Adds 4 random characters
  - Keeps trying until the code is unique in the database
*/
const generateReferralCode = async (name) => {
  // Remove spaces, take first 5 chars, uppercase
  const namePart = name.replace(/\s+/g, '').substring(0, 5).toUpperCase();

  let code;
  let alreadyExists = true;

  // Loop until we find a code that doesn't exist yet
  while (alreadyExists) {
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    code = `${namePart}-${randomPart}`; // e.g. RAHUL-X7K2

    const existing = await User.findOne({ referralCode: code });
    alreadyExists = !!existing; // if found, try again
  }

  return code;
};

module.exports = { generateReferralCode };
