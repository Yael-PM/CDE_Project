import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../../config/db';

type NoteRow = RowDataPacket & {
  note_id: number;
  user_id: number;
  note_title: string;
  note_description: string;
  image_reference: string;
  url_reference: string;
  creation_date: string;
};

const deleteLocalImage = (imagePath: string) => {
  if (!imagePath.startsWith('/uploads/')) return;

  const absolutePath = path.resolve(`.${imagePath}`);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.session.user!.userId;
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(20, Math.max(1, Number(req.query.limit || 10)));
    const offset = (page - 1) * limit;
    const search = String(req.query.search || '').trim();

    let query = `
      SELECT note_id, user_id, note_title, note_description, image_reference, url_reference, creation_date
      FROM note
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (search) {
      query += ` AND note_title LIKE ? `;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY creation_date DESC LIMIT ? OFFSET ? `;
    params.push(limit, offset);

    const [rows] = await pool.execute<NoteRow[]>(query, params);

    let countQuery = 'SELECT COUNT(*) AS total FROM note WHERE user_id = ?';
    const countParams: any[] = [userId];

    if (search) {
      countQuery += ' AND note_title LIKE ?';
      countParams.push(`%${search}%`);
    }

    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, countParams);

    return res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total: Number(countRows[0].total),
        totalPages: Math.ceil(Number(countRows[0].total) / limit)
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
      'SELECT * FROM note WHERE note_id = ? AND user_id = ? LIMIT 1',
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
    const image_reference = req.file ? `/uploads/${req.file.filename}` : '';

    if (!note_title || !note_description || !url_reference || !image_reference) {
      return res.status(400).json({
        message: 'Título, descripción, URL e imagen son obligatorios'
      });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO note (user_id, note_title, note_description, image_reference, url_reference)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, note_title, note_description, image_reference, url_reference]
    );

    return res.status(201).json({
      message: 'Nota creada correctamente',
      noteId: result.insertId
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
      'SELECT * FROM note WHERE note_id = ? AND user_id = ? LIMIT 1',
      [noteId, userId]
    );

    const existing = rows[0];

    if (!existing) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    const note_title = String(req.body.note_title || existing.note_title).trim();
    const note_description = String(req.body.note_description || existing.note_description).trim();
    const url_reference = String(req.body.url_reference || existing.url_reference).trim();

    let image_reference = existing.image_reference;

    if (req.file) {
      image_reference = `/uploads/${req.file.filename}`;
      deleteLocalImage(existing.image_reference);
    }

    await pool.execute(
      `UPDATE note
       SET note_title = ?, note_description = ?, image_reference = ?, url_reference = ?
       WHERE note_id = ? AND user_id = ?`,
      [note_title, note_description, image_reference, url_reference, noteId, userId]
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
      'SELECT * FROM note WHERE note_id = ? AND user_id = ? LIMIT 1',
      [noteId, userId]
    );

    const existing = rows[0];

    if (!existing) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    await pool.execute(
      'DELETE FROM note WHERE note_id = ? AND user_id = ?',
      [noteId, userId]
    );

    deleteLocalImage(existing.image_reference);

    return res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('deleteNote error:', error);
    return res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};