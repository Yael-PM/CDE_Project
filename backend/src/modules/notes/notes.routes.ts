import { Router } from 'express';
import { requireAdmin } from '../../middlewares/auth.middleware';
import { uploadNoteImage } from '../../middlewares/upload.middleware';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from './notes.controller';

const router = Router();

// Rutas públicas
router.get('/', getNotes);
router.get('/:id', getNoteById);

// Rutas protegidas
router.post('/', requireAdmin, uploadNoteImage.single('image'), createNote);
router.put('/:id', requireAdmin, uploadNoteImage.single('image'), updateNote);
router.delete('/:id', requireAdmin, deleteNote);

export default router;
