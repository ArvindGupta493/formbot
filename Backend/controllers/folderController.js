  const Folder = require("../schema/folder.schema");
  const FormBot = require("../schema/formbot.schema"); // Import FormBot model
  const ShareableLink = require("../schema/share.schema");
  const { uuid } = require('uuidv4');

  exports.createFolder = async (req, res) => {
    try {
      const { name } = req.body; // Get the folder name from the request body
  
      // Validate folder name
      if (!name) {
        return res.status(400).json({ message: "Folder name is required" });
      }
  
      // Create a new folder
      const newFolder = new Folder({
        name,
        userId: req.user.id, // Associate the folder with the user (if required)
        forms: [], // Initialize an empty array for forms
      });
  
      await newFolder.save();
  
      res.status(201).json({
        success: true,
        message: "Folder created successfully",
        folder: newFolder,
      });
    } catch (error) {
      console.error("Error creating folder:", error.message);
      res.status(500).json({
        success: false,
        message: "Error creating folder",
      });
    }
  };
  exports.createForm = async (req, res) => {
    try {
      const { folderId } = req.params; // Folder ID from request params
      const { name } = req.body; // Form name from request body
  
      if (!folderId) {
        return res.status(400).json({ message: "Folder ID is required" });
      }
  
      // Find the folder by ID
      const folder = await Folder.findById(folderId);
  
      if (!folder) {
        return res.status(404).json({ message: "Folder not found" });
      }
  
      // Create a new formBot (not Form)
      const formBot = new FormBot({
        name: name || "New Form",
        folder: folderId,
      });
  
      await formBot.save();
  
      // Add formBot to folder's formBots array (not forms)
      folder.formBots.push(formBot._id); // Assuming folder's schema has a formBots array
      await folder.save();
  
      res.status(201).json({ message: "Form created successfully", formBot });
    } catch (error) {
      console.error("Error creating form:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.getFolders = async (req, res) => {
    try {
      // console.log(req.user.id);

      const output = await Folder.find({ userId: req.user.id });
      res.status(200).json({ success: true, output });
    } catch (error) {
      console.log(error);
    }
  };


  //getting forms by folder id

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
      // Find the form by formId
      const form = await FormBot.findById(formId);

      if (!form) {
        return res.status(404).json({
          success: false,
          message: 'Form not found',
        });
      }

      // Return the form data
      res.status(200).json({
        success: true,
        form,  // Send the form details in the response
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


  exports.deleteFolderById = async (req, res) => {
    const { folderId } = req.params;

    try {
      // Find the folder to be deleted
      const folder = await Folder.findById(folderId);
      
      if (!folder) {
        return res.status(404).json({
          success: false,
          message: 'Folder not found',
        });
      }

      // Delete all forms inside the folder before deleting the folder
      await FormBot.deleteMany({ folder: folderId });

      // Delete the folder
      await Folder.findByIdAndDelete(folderId);

      res.status(200).json({
        success: true,
        message: 'Folder and associated forms deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting folder:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error deleting folder',
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
  exports.generateShareLink = async (req, res) => {
    try {
        const formId = req.body.formId; // Get formId from the request body

        if (!formId) {
            return res.status(400).json({ success: false, message: 'Form ID is required' });
        }

        // Logic to generate shareable link
        const link = `${req.protocol}://${req.get('host')}/form/${formId}`;

        return res.status(200).json({ success: true, link });
    } catch (error) {
        console.error('Error generating share link:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};



// folderController.js
exports.shareForm = async (req, res) => {
  const { formId } = req.body;

  try {
      // Find the form by formId
      const form = await FormBot.findById(formId);

      if (!form) {
          return res.status(404).json({ message: "Form not found." });
      }

      // Generate a unique link (can be a short unique ID)
      const shareableLinkId = uuid(); // A simple unique link identifier

      // Save shareable link and form reference
      const shareableLink = new ShareableLink({
          form: form._id,
          linkId: shareableLinkId,
      });

      await shareableLink.save();

      // Return the generated link
      res.json({
          success: true,
          link: `${req.protocol}://${req.get('host')}/form/${shareableLinkId}`, // The URL to be shared
      });
  } catch (error) {
      res.status(500).json({ message: "Error generating shareable link." })
      console.log(error);
  }
};






  exports.createOrUpdateForm = async (req, res) => {
    try {
        const { folderId } = req.params;
        const { formId, name, fields } = req.body; // Get form data from request

        if (!folderId) {
            return res.status(400).json({ message: "Folder ID is required" });
        }

        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        let form;

        if (formId) {
            // Update existing form
            form = await FormBot.findById(formId);
            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }

            form.name = name || form.name; // Update form name
            form.fields = fields; // Update fields
        } else {
            // Create new form if no formId is provided
            form = new FormBot({
                name: name || "New Form",
                folder: folderId,
                fields: fields || [],
            });
            folder.formBots.push(form._id);
        }

        await form.save();
        await folder.save(); // Save folder if a new form is added

        res.status(200).json({
            success: true,
            message: formId ? "Form updated successfully" : "Form created successfully",
            form,
        });
    } catch (error) {
        console.error("Error saving form:", error.message);
        res.status(500).json({ success: false, message: "Error saving form" });
    }
};
