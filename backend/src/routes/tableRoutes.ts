import express from 'express';
import {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
  updateTableStatus,
  updateTablePosition
} from '../controllers/tableController';

const router = express.Router();

router.post('/', createTable);
router.get('/', getAllTables);
router.get('/:id', getTableById);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);
router.patch('/:id/status', updateTableStatus);
router.patch('/:id/position', updateTablePosition);

export default router; 