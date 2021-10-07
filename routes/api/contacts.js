const express = require('express');
const router = express.Router();
const { getContacts, getContactById, addContact, removeContact, updateContact, updateStatus} = require('../../controllers/contacts');
const { schemaContact, schemaUpdateContact, schemaPutContact, schemaStatusContact} = require('../../services/validationContacts');

router.get('/', getContacts);

router.get('/:contactId', getContactById);

router.post('/', schemaContact, addContact);

router.delete('/:contactId', removeContact);

router.put('/:contactId', schemaPutContact, updateContact);

router.patch('/:contactId/favorite', [schemaStatusContact, schemaUpdateContact], updateStatus);

module.exports = router;