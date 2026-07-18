import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
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
router.post('/', requireAuth, uploadNoteImage.single('image'), createNote);
router.put('/:id', requireAuth, uploadNoteImage.single('image'), updateNote);
router.delete('/:id', requireAuth, deleteNote);

export default router;
