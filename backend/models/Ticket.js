const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      enum: ['Admin', 'Customer']
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: 'Open',
      enum: ['Open', 'In Progress', 'Resolved']
    },
    replies: [replySchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
