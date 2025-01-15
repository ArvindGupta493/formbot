const mongoose = require('mongoose');

// ShareableLink Schema
const shareableLinkSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'FormBot' }, // Reference to Form
  linkId: { type: String, unique: true }, // Unique shareable link ID
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the link was created
});

const ShareableLink = mongoose.model('ShareableLink', shareableLinkSchema);

module.exports = ShareableLink;