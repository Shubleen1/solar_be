// src/controllers/adminController.js
const adminService = require('../services/adminService');

const getStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const data = await adminService.getPaginatedLeads(status, page, limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await adminService.updateLeadStatus(req.params.id, req.body);
    res.json({ message: '✅ Lead updated successfully', lead });
  } catch (err) {
    if (err.message === 'Lead not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

const payCommission = async (req, res) => {
  try {
    const lead = await adminService.processCommissionPayment(req.params.id);
    res.json({ message: '✅ Commission marked as paid!', lead });
  } catch (err) {
    if (err.message === 'Lead not found') return res.status(404).json({ message: err.message });
    if (err.message.includes('must be approved')) return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllReferrers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const user = await adminService.promoteUserToAdmin(req.body.email);
    res.json({ message: `✅ ${user.name} is now an admin`, user });
  } catch (err) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStats,
  getLeads,
  updateLead,
  payCommission,
  getUsers,
  makeAdmin
};