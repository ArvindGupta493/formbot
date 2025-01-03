const express = require('express');
const { createFolder, createForm, getFolders, getFormsByFolderId,updateFormById,deleteFolderById,deleteFormById ,createOrUpdateForm,generateShareLink } = require('../controllers/folderController');
const router = express.Router();
const auth = require('../middlewares/AuthMiddleware'); // Middleware for user authentication
const { getFormById } = require('../controllers/folderController');

// Route to create a new folder
router.post('/create-folder', auth, createFolder);
router.post('/folder/:folderId/create-form', auth, createForm);    // Route to create a form bot in a specific folder
router.get('/folders/:id', auth, getFolders);                      // Route to get all folders of the user
router.get('/folders/:folderId/forms', auth, getFormsByFolderId);  // Define the route for fetching forms by folder ID
router.delete('/folder/:folderId', deleteFolderById);

router.get('/form/:formId', getFormById);  
router.put('/form/:formId', updateFormById);
router.delete('/form/:formId', deleteFormById);

// folder.route.js
// router.post('/generate-share-link', shareForm);
router.post('/generate-share-link', auth, generateShareLink);


// router.post('/generate-share-link',shareForm)
router.post('/folder/:folderId/create-or-update-form', auth, createOrUpdateForm);

module.exports = router;
    