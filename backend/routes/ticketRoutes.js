const express = require('express');
const router = express.Router();
const {
  getMyTickets,
  createTicket,
  addTicketReply,
  getAllTickets,
  updateTicketStatus
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTicket)
  .get(protect, admin, getAllTickets);

router.get('/my', protect, getMyTickets);
router.post('/:id/reply', protect, addTicketReply);
router.put('/:id/status', protect, admin, updateTicketStatus);

module.exports = router;
