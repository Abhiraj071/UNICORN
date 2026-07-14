const Ticket = require('../models/Ticket');

// @desc    Get support tickets for logged-in user
// @route   GET /api/tickets/my
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      description
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a message reply to a support ticket thread
// @route   POST /api/tickets/:id/reply
// @access  Private
const addTicketReply = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      // Ensure user owns ticket OR is admin
      const isOwner = ticket.user.toString() === req.user._id.toString();
      const isAdmin = req.user.isAdmin;

      if (!isOwner && !isAdmin) {
        return res.status(401).json({ message: 'Not authorized to access this ticket thread' });
      }

      const { message } = req.body;
      const sender = isAdmin ? 'Admin' : 'Customer';

      ticket.replies.push({ sender, message });
      
      // Auto transition status if admin replies
      if (isAdmin && ticket.status === 'Open') {
        ticket.status = 'In Progress';
      }

      const updated = await ticket.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all tickets in system
// @route   GET /api/tickets
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      ticket.status = req.body.status || ticket.status;
      const updated = await ticket.save();
      
      const populated = await Ticket.findById(updated._id)
        .populate('user', 'name email');
        
      res.json(populated);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMyTickets,
  createTicket,
  addTicketReply,
  getAllTickets,
  updateTicketStatus
};
