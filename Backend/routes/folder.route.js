const express = require('express');
const { createFolder, createForm, getFolders, getFormsByFolderId,updateFormById,deleteFolderById,deleteFormById ,generateShareLink}   
   = require('../controllers/folderController');
const router = express.Router();
const auth = require('../middlewares/AuthMiddleware'); 
const { getFormById } = require('../controllers/folderController');

// Route to create a new folder
router.post('/create-folder', auth, createFolder);
router.post('/folder/:folderId/create-form', auth, createForm);    
router.get('/folders/:id', auth, getFolders);                     
router.get('/folders/:folderId/forms', auth, getFormsByFolderId);
router.delete('/folder/:folderId', deleteFolderById);

router.get('/form/:formId', getFormById);  
router.put('/form/:formId', updateFormById);
router.delete('/form/:formId', deleteFormById);

// folder.route.js     that are not used in frontend
router.post('/generate-share-link', auth, generateShareLink);

module.exports = router;
    
