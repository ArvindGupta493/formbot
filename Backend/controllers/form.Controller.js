const Folder = require("../schema/folder.schema");
const FormBot = require("../schema/formbot.schema"); // Import FormBot model
const ShareableLink = require("../schema/share.schema");
const FormResponse = require('../schema/formResponse.schema');
const { v4: uuidv4 } = require('uuid'); 

exports.getFormsByFolderId = async (req, res) => {
  const { folderId } = req.params; // Get the folder ID from the request params
  console.log('Folder ID:', folderId);
  try {
    // Step 1: Find the folder by ID
    const folder = await Folder.findById(folderId).populate('formBots'); // Populate formBots in the folder

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found',
      });
    }
 
    // Step 2: Return the form bots associated with this folder
    res.status(200).json({
      success: true,
      forms: folder.formBots,  // All form bots associated with the folder
    });
  } catch (error) {
    console.error('Error fetching forms by folder ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
    });
  }
};


exports.getFormById = async (req, res) => {
  const { formId } = req.params; // Get formId from the request params
  
  try {
    const form = await FormBot.findById(formId);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    res.status(200).json({
      success: true,
      form,
    });
  } catch (error) {
    console.error('Error fetching form by formId:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching form details',
    });
  }
};




exports.updateFormById = async (req, res) => {
  const { formId } = req.params;  // Get formId from request params
  const { formBotName, fields } = req.body; // Get form name and fields to be updated
  console.log('Form ID:', formId);
  try {
    // Step 1: Find the form by ID
    const form = await FormBot.findById(formId);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Step 2: Update form data
    form.name = formBotName || form.name; // Update name if provided
    form.fields = fields;  // Update the fields (bubbles and inputs)

    // Step 3: Save the updated form
    await form.save();

    // Step 4: Respond with success
    res.status(200).json({
      success: true,
      message: 'Form updated successfully!',
      form: form,
    });
  } catch (error) {
    console.error('Error updating form:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
    });
  }
};



// Delete Form by ID
exports.deleteFormById = async (req, res) => {
  const { formId } = req.params;

  try {
    // Find the form to be deleted
    const form = await FormBot.findById(formId);
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found',
      });
    }

    // Remove the form from its folder's formBots array
    await Folder.findByIdAndUpdate(form.folder, { $pull: { formBots: formId } });

    // Delete the form from the database
    await FormBot.findByIdAndDelete(formId);

    res.status(200).json({
      success: true,
      message: 'Form deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting form:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
    });
  }
};
  
   
// POST: /api/forms/generate-share-link


exports.shareForm = async (req, res) => {
  console.log("Share route accessed");
  let { formId } = req.params;

  formId = formId.trim();
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(formId);

  if (!isValidObjectId) {
    console.log("Invalid Form ID:", formId);
    return res.status(400).json({ message: "Invalid Form ID" });
  }
   
  try {
    const form = await FormBot.findById(formId);
    if (!form) {
      console.log("Form not found in database for ID:", formId);
      return res.status(404).json({ message: "Form not found." });
    }

    const shareableLinkId = uuidv4();
    console.log("Generated shareable link ID:", shareableLinkId);

    const shareableLink = new ShareableLink({
      form: form._id,
      linkId: shareableLinkId,
    });
    await shareableLink.save();

    const frontendUrl = 'http://localhost:5173'; 

    const fullLink = `${frontendUrl}/chatbot/${shareableLinkId}`;
    console.log("Shareable link saved:", fullLink);
    
    res.json({
      success: true,
      link: fullLink,
      linkId: shareableLinkId,
    });
  } catch (error) {
    console.error("Error generating shareable link:", error);
    res.status(500).json({ message: "Error generating shareable link." });
  }
};




exports.getSharedForm = async (req, res) => {
  try {
    const { linkId } = req.params;
    console.log("Received link ID:", linkId);

    if (!linkId) {
      return res.status(400).json({ message: "Invalid link ID." });
    }
   
    const shareableLink = await ShareableLink.findOne({ linkId }).populate('form');
    if (!shareableLink) {
      console.log("No matching link found for ID:", linkId);
      return res.status(404).json({ message: "Forms link not found." });
    }

    const form = shareableLink.form;
    console.log("Form retrieved:", form);

    form.viewCount = (form.viewCount || 0) + 1;
    await form.save();

    const sortedFields = form.fields.sort((a, b) => a.sequence - b.sequence);

    res.json({
      success: true,
      form: {
        _id: form._id,
        name: form.name,
        fields: sortedFields,
      },
    });
  } catch (error) {
    console.error("Error retrieving form for chatbot:", error);
    res.status(500).json({ message: "Error fetching form data." });
  }
};

exports.saveFormResponse = async (req, res) => {
  try {
    const { formId, responses } = req.body;

    if (!formId || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid form ID or responses' });
    }

    const form = await FormBot.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    form.startedCount = form.startedCount || 0;
    form.submittedCount = form.submittedCount || 0;

    // Mark form as started if no previous interactions
    if (!form.startedAt) {
      form.startedCount += 1;
      form.startedAt = new Date();
      await form.save();
    }

    const requiredFields = form.fields.filter((field) => field.required);
    const allResponsesSubmitted = requiredFields.every((field) => {
      const response = responses.find((r) => r.label === field.label);
      return response && response.value !== undefined && response.value !== null && String(response.value).trim() !== '';
    });

    const formResponse = new FormResponse({
      form: formId,
      responses,
      submittedAt: new Date(), 
    });
    await formResponse.save();

    if (allResponsesSubmitted) {
      form.submittedCount += 1;
      await form.save();
    }

    console.log('Updated Submitted Count:', form.submittedCount);

    res.json({ success: true, message: 'Form responses saved successfully' });
  } catch (error) {
    console.error('Error saving form responses:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

     

// GET /api/forms/responses/677bbd5978cc98375b055a21

exports.getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    console.log("Form ID:", formId);

    const formResponses = await FormResponse.find({ form: formId }).populate('form');

    if (!formResponses || formResponses.length === 0) {
      return res.status(404).json({ success: false, message: "No responses found for this form" });
    }

    res.status(200).json({
      success: true,
      data: formResponses,
      submittedAt: new Date(), 
    });
  } catch (error) {
    console.error("Error fetching form responses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


