import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { uploadNoteImage } from '../../middlewares/upload.middleware';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote
} from './notes.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', uploadNoteImage.single('image'), createNote);
router.put('/:id', uploadNoteImage.single('image'), updateNote);
router.delete('/:id', deleteNote);

export default router;