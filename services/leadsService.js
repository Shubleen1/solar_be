const Lead = require('../models/Lead');
const User = require('../models/User');
const { sendEmail, newLeadEmail } = require('../utils/sendEmail');

const submitNewLead = async (leadData) => {
  const { customerName, customerEmail, customerPhone, customerCity, propertyType, message, referralCode } = leadData;

  if (!customerName || !customerPhone || !customerCity) {
    throw new Error('Please fill all required fields');
  }

  let referrer = null;
  if (referralCode) {
    referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!referrer) throw new Error('Invalid referral code');
  } else {
    throw new Error('Invalid referral code. Please check and try again.');
  }

  const duplicate = await Lead.findOne({
    customerPhone,
    referralCode: referralCode.toUpperCase(),
  });
  if (duplicate) throw new Error('This phone number already submitted an inquiry with this code.');

  const lead = await Lead.create({
    customerName,
    customerEmail: customerEmail || '',
    customerPhone,
    customerCity,
    propertyType: propertyType || 'home',
    message: message || '',
    referralCode: referralCode.toUpperCase(),
    referrerId: referrer._id,
    commissionPercent: Number(process.env.COMMISSION_PERCENT) || 5,
  });

  await User.findByIdAndUpdate(referrer._id, { $inc: { totalLeads: 1 } });

  const emailTemplate = newLeadEmail(referrer.name, customerName, customerCity);
  await sendEmail({ to: referrer.email, ...emailTemplate });

  return lead;
};

module.exports = { submitNewLead };