const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNotesHandler = (Request, h) => {
  const { title, tags, body } = Request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id, title, tags, body, createdAt, updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((el) => el.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    })
      .code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  })
    .code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteById = (Request, h) => {
  const { id } = Request.params;

  const note = notes.filter((el) => el.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  })
    .code(404);
  return response;
};

const updateNoteById = (request, h) => {
  const { id } = request.params;

  const { body, title, tags } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      body,
      tags,
      title,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dirubah',
    })
      .code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'gagal memperbarui catatan. catatan tidak ditemukan',
  })
    .code(404);

  return response;
};

const deleteNoteById = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    })
      .code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menghapus cacatan. catatan tidak ditemukan',
  })
    .code(404);

  return response;
};

module.exports = {
  addNotesHandler,
  getAllNotesHandler,
  getNoteById,
  updateNoteById,
  deleteNoteById,
};