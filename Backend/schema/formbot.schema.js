const mongoose = require('mongoose');

// Define the FormBot Schema
const FormBotSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the form bot
  fields: [
    {
      label: { type: String, required: true },  // The label for the field
      type: { type: String, enum: ['bubble', 'input'], required: true },  // Field type: bubble or input
      prefilled: { type: Boolean, default: false },  // Whether the input field is prefilled with data
      sequence: { type: Number, required: true },  // The order in which this field appears
      inputType: { 
        type: String, 
        enum: ['text', 'email', 'number', 'date'],  // Only relevant for input fields
        required: function() { return this.type === 'input'; }
      },
      value: { type: String, default: '' }  // Used for prefilled or user input (only relevant for input fields)
    }
  ],
  createdAt: { type: Date, default: Date.now },  // Timestamp when the form bot is created
  updatedAt: { type: Date, default: Date.now }   // Timestamp when the form bot is updated
});

module.exports = mongoose.model('FormBot', FormBotSchema);
