import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  shape: {
    type: String,
    enum: ['square', 'round', 'rectangular'],
    default: 'square'
  }
}, {
  timestamps: true
});

const Table = mongoose.model('Table', tableSchema);
export default Table; 