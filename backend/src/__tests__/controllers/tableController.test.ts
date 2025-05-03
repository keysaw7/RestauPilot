import request from 'supertest';
import app from '../../app';
import Table from '../../models/Table';
import mongoose from 'mongoose';

describe('Table Controller', () => {
  const tableData = {
    number: 1,
    capacity: 4,
    status: 'available' as const,
    position: {
      x: 0,
      y: 0
    },
    shape: 'square' as const
  };

  it('should create a new table', async () => {
    const response = await request(app)
      .post('/api/tables')
      .send(tableData);

    expect(response.status).toBe(201);
    expect(response.body.number).toBe(tableData.number);
    expect(response.body.capacity).toBe(tableData.capacity);
  });

  it('should get all tables', async () => {
    await Table.create(tableData);
    const response = await request(app).get('/api/tables');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a table by id', async () => {
    const table = await Table.create(tableData);
    const response = await request(app).get(`/api/tables/${table._id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(table._id.toString());
  });

  it('should update a table', async () => {
    const table = await Table.create(tableData);
    const updateData = { capacity: 6 };
    const response = await request(app)
      .put(`/api/tables/${table._id}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.capacity).toBe(updateData.capacity);
  });

  it('should delete a table', async () => {
    const table = await Table.create(tableData);
    const response = await request(app).delete(`/api/tables/${table._id}`);

    expect(response.status).toBe(204);
    const deletedTable = await Table.findById(table._id);
    expect(deletedTable).toBeNull();
  });

  it('should return 404 for non-existent table', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/tables/${nonExistentId}`);

    expect(response.status).toBe(404);
  }, 10000);
}); 