const mongoose = require('mongoose');

// ShareableLink Schema
const shareableLinkSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  linkId: { type: String, unique: true },
});

const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);
module.exports = ShareableLink;

// FormResponse Schema
const formResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
  responses: [Object], // Store responses as an array of key-value pairs
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);
module.exports = FormResponse;
