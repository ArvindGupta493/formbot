
const express = require('express');
const router = express.Router();

const { getFormsByFolderId,updateFormById,deleteFormById, getFormById,shareForm ,getSharedForm, saveFormResponse,getFormResponses} = require('../controllers/form.Controller');

router.get('/:folderId/forms', getFormsByFolderId);
router.get('/form/:formId', getFormById);
router.put('/form/:formId', updateFormById);
router.delete('/form/:formId', deleteFormById);


// Route to get form by shareable link
router.post('/share/:formId',shareForm);
router.get('/share/:linkId', getSharedForm);
router.post('/save-response', saveFormResponse);
 
router.get('/responses/:formId', getFormResponses);

module.exports = router;  

    