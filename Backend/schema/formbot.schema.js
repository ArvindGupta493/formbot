const mongoose = require('mongoose');

// Define the FormBot Schema
const FormBotSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The name of the form bot
  fields: [
    {
      label: { type: String, required: true }, // The label for the field
      type: { 
        type: String, 
        enum: ['bubble', 'input', 'rating', 'buttons'], // Added 'rating' and 'buttons'
        required: true 
      },
      prefilled: { type: Boolean, default: false }, // Whether the input field is prefilled with data
      sequence: { type: Number, required: true }, // The order in which this field appears
      
      inputType: { 
        type: String, 
        enum: ['text', 'email', 'number', 'date'], // Only relevant for 'input' fields
        required: function() { return this.type === 'input'; },
        default: function() { return this.type === 'input' ? 'text' : undefined; } // Fix: Default for 'input' type
      },

      value: { 
        type: mongoose.Schema.Types.Mixed, // Allows text, numbers, or other values
        default: '' 
      },

      options: { 
        type: [String], 
        default: undefined, 
        required: function() { return this.type === 'buttons'; } // Required only for buttons
      }
    }
  ],
  viewCount: { type: Number, default: 0 },
  startedCount: { type: Number, default: 0 },
  submittedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }, // Timestamp when the form bot is created
  updatedAt: { type: Date, default: Date.now } // Timestamp when the form bot is updated
});

module.exports = mongoose.model('FormBot', FormBotSchema);
