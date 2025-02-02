const {
  getContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactsService");
const {
  WrongParametersError,
  MissingFieldsError,
} = require("../helpers/errors");

async function getContactsController(req, res, next) {
  const owner = req.user._id;
  const { page = 1, limit = 20, favorite } = req.query;

  const contacts = await getContacts(owner, { page, limit, favorite });
  res.json(contacts);
}

async function getContactByIdController(req, res, next) {
  const owner = req.user._id;
  const { contactId } = req.params;
  const contact = await getContactById(contactId, owner);
  if (!contact) {
    throw new WrongParametersError("Not found");
  }
  res.json(contact);
}

async function postContactController(req, res, next) {
  const owner = req.user._id;
  const contact = await addContact(req.body, owner);
  res.status(201).json(contact);
}

async function deleteContactController(req, res, next) {
  const { contactId } = req.params;
  const owner = req.user._id;
  await removeContact(contactId, owner);
  res.json({ message: "contact deleted" });
}

async function changeContactController(req, res, next) {
  const owner = req.user._id;
  if (!req.body) {
    throw new MissingFieldsError("Missing fields");
  }

  const contact = await updateContact(req.params.contactId, req.body, owner);
  if (!contact) {
    throw new WrongParametersError("Not found");
  }

  res.json(contact);
}

async function changeFavoriteStatusController(req, res, next) {
  const owner = req.user._id;

  if (!req.body) {
    throw new MissingFieldsError("Missing field favorite");
  }
  const contact = await updateStatusContact(
    req.params.contactId,
    req.body,
    owner
  );
  if (!contact) {
    throw new WrongParametersError("Not found");
  }
  res.json(contact);
}

module.exports = {
  getContactsController,
  getContactByIdController,
  postContactController,
  deleteContactController,
  changeContactController,
  changeFavoriteStatusController,
};
