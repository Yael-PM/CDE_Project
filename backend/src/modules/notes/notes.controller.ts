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

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.userId;
    const search = String(req.query.search || '').trim();
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 20);
    const offset = (page - 1) * limit;

    let query = `
      SELECT note_id, user_id, note_title, note_description, image_reference,
             cloudinary_public_id, url_reference, creation_date
      FROM note
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (search) {
      query += ` AND note_title LIKE ? `;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY creation_date DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.execute<NoteRow[]>(query, params);

    let countQuery = `SELECT COUNT(*) AS total FROM note WHERE user_id = ?`;
    const countParams: any[] = [userId];

    if (search) {
      countQuery += ` AND note_title LIKE ?`;
      countParams.push(`%${search}%`);
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
    const userId = req.session.user!.userId;
    const noteId = Number(req.params.id);

    const [rows] = await pool.execute<NoteRow[]>(
      `SELECT note_id, user_id, note_title, note_description, image_reference,
              cloudinary_public_id, url_reference, creation_date
       FROM note
       WHERE note_id = ? AND user_id = ?
       LIMIT 1`,
      [noteId, userId]
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
  try {
    const userId = req.session.user!.userId;
    const note_title = String(req.body.note_title || '').trim();
    const note_description = String(req.body.note_description || '').trim();
    const url_reference = String(req.body.url_reference || '').trim();

    if (!note_title || !note_description || !url_reference) {
      return res.status(400).json({
        message: 'Título, descripción y URL son obligatorios'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'La imagen es obligatoria'
      });
    }

    const uploaded = await uploadImageToCloudinary(req.file.buffer);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO note
       (user_id, note_title, note_description, image_reference, cloudinary_public_id, url_reference)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        note_title,
        note_description,
        uploaded.secure_url,
        uploaded.public_id,
        url_reference
      ]
    );

    return res.status(201).json({
      message: 'Nota creada correctamente',
      noteId: result.insertId,
      imageUrl: uploaded.secure_url
    });
  } catch (error) {
    console.error('createNote error:', error);
    return res.status(500).json({ message: 'Error al crear la nota' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.userId;
    const noteId = Number(req.params.id);

    const [rows] = await pool.execute<NoteRow[]>(
      `SELECT * FROM note WHERE note_id = ? AND user_id = ? LIMIT 1`,
      [noteId, userId]
    );

    const note = rows[0];

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    const note_title = String(req.body.note_title || note.note_title).trim();
    const note_description = String(req.body.note_description || note.note_description).trim();
    const url_reference = String(req.body.url_reference || note.url_reference).trim();

    let image_reference = note.image_reference;
    let cloudinary_public_id = note.cloudinary_public_id;

    if (req.file) {
      const uploaded = await uploadImageToCloudinary(req.file.buffer);

      if (note.cloudinary_public_id) {
        await deleteImageFromCloudinary(note.cloudinary_public_id);
      }

      image_reference = uploaded.secure_url;
      cloudinary_public_id = uploaded.public_id;
    }

    await pool.execute(
      `UPDATE note
       SET note_title = ?, note_description = ?, image_reference = ?, cloudinary_public_id = ?, url_reference = ?
       WHERE note_id = ? AND user_id = ?`,
      [
        note_title,
        note_description,
        image_reference,
        cloudinary_public_id,
        url_reference,
        noteId,
        userId
      ]
    );

    return res.json({ message: 'Nota actualizada correctamente' });
  } catch (error) {
    console.error('updateNote error:', error);
    return res.status(500).json({ message: 'Error al actualizar la nota' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.userId;
    const noteId = Number(req.params.id);

    const [rows] = await pool.execute<NoteRow[]>(
      `SELECT * FROM note WHERE note_id = ? AND user_id = ? LIMIT 1`,
      [noteId, userId]
    );

    const note = rows[0];

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (note.cloudinary_public_id) {
      await deleteImageFromCloudinary(note.cloudinary_public_id);
    }

    await pool.execute(
      `DELETE FROM note WHERE note_id = ? AND user_id = ?`,
      [noteId, userId]
    );

    return res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('deleteNote error:', error);
    return res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};