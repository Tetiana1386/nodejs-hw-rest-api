const Contacts = require('../repository/contacts');
const { HttpCode } = require('../helpers/constants');
const { CustomError } = require('../helpers/customError');

const getContacts = async (req, res) => {
    const userId = req.user._id;
        const data = await Contacts.listContacts(userId, req.query);
        res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Contacts found',
            data: { ...data }
        });
};

const getContactById = async (req, res) => {
    const userId = req.user._id;
    const contact = await Contacts.getContactById(req.params.contactId, userId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact found',
                data: { contact }
            });
        }
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const addContact = async (req, res) => {
    const userId = req.user._id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
        res.status(HttpCode.CREATED).json({
            status: 'Success',
            code: HttpCode.CREATED,
            message: 'Contact successfully created',
            data: {
                contact,
            },
        });
};

const removeContact = async (req, res) => {
    const userId = req.user._id;
    const contact = await Contacts.removeContact(req.params.contactId, userId);
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact deleted',
                data: {
                    contact,
                },
            });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const updateContact = async (req, res) => {
    const userId = req.user._id;
    const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
        userId,
    );
    if (contact) {
        return res.json({
            status: 'Success',
            code: HttpCode.OK,
            message: 'Contact updated successfully',
            data: {
                contact,
            },
        });
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

const updateStatusContact = async (req, res) => {
    const userId = req.user._id
    const contact = await Contacts.updateContact(
        req.params.contactId,
        req.body,
        userId,
    );
        if (contact) {
            return res.json({
                status: 'Success',
                code: HttpCode.OK,
                message: 'Contact updated successfully',
                data: {
                    contact,
                },
            });
        };
        throw new CustomError(HttpCode.NOT_FOUND, 'Not Found');
};

module.exports = {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,
};