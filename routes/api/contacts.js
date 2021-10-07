const express = require('express');
const router = express.Router();
const { getContacts, getContactById, addContact, removeContact, updateContact, updateStatusContact} = require('../../controllers/contacts');
const { validContact, validUpdateContact, validPutContact, validStatusContact, validId} = require('../../services/validationContacts');

router.get('/', getContacts);

router.get('/:contactId', getContactById);

router.post('/', validContact, addContact);

router.delete('/:contactId', validId, removeContact);

router.put('/:contactId', validId, validPutContact, updateContact);

router.patch('/:contactId/favorite', validId, validStatusContact, validUpdateContact, updateStatusContact);

module.exports = router;