import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary
} from '../../utils/cloudinary';

type NoteRow = RowDataPacket & {
  note_id: number;
  user_id: number;
  note_title: string;
  note_description: string;
  image_reference: string;
  cloudinary_public_id: string | null;
  url_reference: string;
  creation_date: string;
};

type PublicNoteRow = RowDataPacket & {
  note_id: number;
  note_title: string;
  note_description: string;
  image_reference: string;
  url_reference: string;
  creation_date: string;
};

type UploadedImage = {
  secure_url: string;
  public_id: string;
};

const parsePositiveInteger = (value: unknown, fallback: number, max?: number) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return max ? Math.min(parsed, max) : parsed;
};

const parseNoteId = (value: unknown) => {
  const noteId = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(noteId) && noteId > 0 ? noteId : null;
};

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const removeCloudinaryImageSafely = async (publicId: string | null) => {
  if (!publicId) return;

  try {
    await deleteImageFromCloudinary(publicId);
  } catch (error) {
    console.error(`No se pudo eliminar el asset ${publicId} de Cloudinary:`, error);
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const search = String(req.query.search || '').trim();
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = parsePositiveInteger(req.query.limit, 10, 20);
    const offset = (page - 1) * limit;

    let query = `
      SELECT note_id, note_title, note_description, image_reference,
             url_reference, creation_date
      FROM note
    `;
    const params: string[] = [];

    if (search) {
      query += ' WHERE note_title LIKE ? OR note_description LIKE ? ';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY creation_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await pool.execute<PublicNoteRow[]>(query, params);

    let countQuery = 'SELECT COUNT(*) AS total FROM note';
    const countParams: string[] = [];

    if (search) {
      countQuery += ' WHERE note_title LIKE ? OR note_description LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, countParams);
    const total = Number(countRows[0].total);

    return res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getNotes error:', error);
    return res.status(500).json({ message: 'Error al obtener notas' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const noteId = parseNoteId(req.params.id);

    if (!noteId) {
      return res.status(400).json({ message: 'Identificador de nota inválido' });
    }

    const [rows] = await pool.execute<PublicNoteRow[]>(
      `SELECT note_id, note_title, note_description, image_reference,
              url_reference, creation_date
       FROM note
       WHERE note_id = ?
       LIMIT 1`,
      [noteId]
    );

    const note = rows[0];

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    return res.json(note);
  } catch (error) {
    console.error('getNoteById error:', error);
    return res.status(500).json({ message: 'Error al obtener la nota' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  let uploaded: UploadedImage | null = null;

  try {
    const userId = req.session.user!.userId;
    const noteTitle = String(req.body.note_title || '').trim();
    const noteDescription = String(req.body.note_description || '').trim();
    const urlReference = String(req.body.url_reference || '').trim();

    if (!noteTitle || !noteDescription || !urlReference) {
      return res.status(400).json({
        message: 'Título, descripción y URL son obligatorios'
      });
    }

    if (!isValidHttpUrl(urlReference)) {
      return res.status(400).json({ message: 'La URL de referencia no es válida' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'La imagen es obligatoria' });
    }

    uploaded = await uploadImageToCloudinary(req.file.buffer);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO note
       (user_id, note_title, note_description, image_reference, cloudinary_public_id, url_reference)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        noteTitle,
        noteDescription,
        uploaded.secure_url,
        uploaded.public_id,
        urlReference
      ]
    );

    return res.status(201).json({
      message: 'Nota creada correctamente',
      noteId: result.insertId,
      imageUrl: uploaded.secure_url
    });
  } catch (error) {
    if (uploaded) await removeCloudinaryImageSafely(uploaded.public_id);
    console.error('createNote error:', error);
    return res.status(500).json({ message: 'Error al crear la nota' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  let uploaded: UploadedImage | null = null;
  let databaseUpdated = false;

  try {
    const noteId = parseNoteId(req.params.id);

    if (!noteId) {
      return res.status(400).json({ message: 'Identificador de nota inválido' });
    }

    const [rows] = await pool.execute<NoteRow[]>(
      'SELECT * FROM note WHERE note_id = ? LIMIT 1',
      [noteId]
    );

    const note = rows[0];

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    const noteTitle = req.body.note_title === undefined
      ? note.note_title
      : String(req.body.note_title).trim();
    const noteDescription = req.body.note_description === undefined
      ? note.note_description
      : String(req.body.note_description).trim();
    const urlReference = req.body.url_reference === undefined
      ? note.url_reference
      : String(req.body.url_reference).trim();

    if (!noteTitle || !noteDescription || !urlReference) {
      return res.status(400).json({
        message: 'Título, descripción y URL son obligatorios'
      });
    }

    if (!isValidHttpUrl(urlReference)) {
      return res.status(400).json({ message: 'La URL de referencia no es válida' });
    }

    if (req.file) {
      uploaded = await uploadImageToCloudinary(req.file.buffer);
    }

    const imageReference = uploaded?.secure_url || note.image_reference;
    const cloudinaryPublicId = uploaded?.public_id || note.cloudinary_public_id;

    await pool.execute<ResultSetHeader>(
      `UPDATE note
       SET note_title = ?, note_description = ?, image_reference = ?,
           cloudinary_public_id = ?, url_reference = ?
       WHERE note_id = ?`,
      [
        noteTitle,
        noteDescription,
        imageReference,
        cloudinaryPublicId,
        urlReference,
        noteId
      ]
    );
    databaseUpdated = true;

    if (uploaded && note.cloudinary_public_id !== uploaded.public_id) {
      await removeCloudinaryImageSafely(note.cloudinary_public_id);
    }

    return res.json({
      message: 'Nota actualizada correctamente',
      imageUrl: imageReference
    });
  } catch (error) {
    if (uploaded && !databaseUpdated) {
      await removeCloudinaryImageSafely(uploaded.public_id);
    }
    console.error('updateNote error:', error);
    return res.status(500).json({ message: 'Error al actualizar la nota' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const noteId = parseNoteId(req.params.id);

    if (!noteId) {
      return res.status(400).json({ message: 'Identificador de nota inválido' });
    }

    const [rows] = await pool.execute<NoteRow[]>(
      'SELECT * FROM note WHERE note_id = ? LIMIT 1',
      [noteId]
    );

    const note = rows[0];

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    await pool.execute<ResultSetHeader>('DELETE FROM note WHERE note_id = ?', [noteId]);
    await removeCloudinaryImageSafely(note.cloudinary_public_id);

    return res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('deleteNote error:', error);
    return res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};
