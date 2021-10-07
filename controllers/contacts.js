const Contacts = require('../repository/contacts');

const getContacts = async (_req, res, next) => {
    try {
        const contacts = await Contacts.listContacts();
        return res.json({
            status: 'Success',
            code: 200,
            message: 'Contacts found',
            data: { contacts }
        });
    } catch (e) {
        next(e);
    };
};

const getContactById = async (req, res, next) => {
    try {
        const contact = await Contacts.getContactById(req.params.contactId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: 200,
                message: 'Contact found',
                data: { contact }
            });
        } else {
            return res.status(404).json({
                status: 'Error',
                code: 404,
                message: 'Not Found',
            });
        }
    } catch (e) {
        next(e);
    };
};

const addContact = async (req, res, next) => {
    try {
        const contact = await Contacts.addContact(req.body);
        return res.status(201).json({
            status: 'Success',
            code: 201,
            message: 'Contact successfully created',
            data: {
                contact,
            },
        });
    } catch (e) {
        next(e);
    };
};

const removeContact = async (req, res, next) => {
    try {
        const contact = await Contacts.removeContact(req.params.contactId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: 200,
                message: 'Contact deleted',
                data: {
                    contact,
                },
            });
        } else {
            return res.status(404).json({
                status: 'Error',
                code: 404,
                message: 'Not Found',
            });
        }
    } catch (e) {
        next(e);
    };
};

const updateContact = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'Error',
                code: 400,
                message: 'Bad request',
            });
        }
        const contact = await Contacts.updateContact(
            req.params.contactId,
            req.body,
        );
        if (contact) {
            return res.json({
                status: 'Success',
                code: 200,
                message: 'Contact updated successfully',
                data: {
                    contact,
                },
            });
        } else {
            return res.status(404).json({
                status: 'Error',
                code: 404,
                message: 'Not Found',
            });
        }
    } catch (e) {
        next(e);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const contact = await Contacts.updateContact(
            req.params.contactId,
            req.body,
        );
        if (contact) {
            return res.json({
                status: 'Success',
                code: 200,
                message: 'Contact updated successfully',
                data: {
                    contact,
                },
            });
        } else {
            return res.status(404).json({
                status: 'Error',
                code: 404,
                message: 'Not Found',
            });
        }
    } catch (e) {
        next(e);
    }
};

module.exports = {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatus,
};