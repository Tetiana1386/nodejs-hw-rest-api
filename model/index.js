const shortid = require('shortid');
const DB = require('./ db');
const db = new DB(contacts.json);

const listContacts = async () => {
  return await db.read();
};

const getContactById = async (contactId) => {
  const contacts = await db.read();
  const contact = contacts.find(contact => contact.id.toString() === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await db.read();
  const contact = contacts.find(contact => contact.id.toString() === contactId);
  if (!contact) return;
  const newContacts = contacts.filter(contact => contact.id.toString() !== contactId);
  await db.write(newContacts);
  return contact;
};

const addContact = async (body) => {
  const contacts = await db.read();
  const newContact = { id: shortid.generate(), ...body };
  const newContacts = [...contacts, newContact];
  await db.write(newContacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await db.read();
  const index = contacts.findIndex((contact) => contact.id.toString() === contactId);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await db.write(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
