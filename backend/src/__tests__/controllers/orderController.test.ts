import request from 'supertest';
import app from '../../app';
import Order from '../../models/Order';
import Menu from '../../models/Menu';
import Table from '../../models/Table';
import mongoose from 'mongoose';

describe('Order Controller', () => {
  let testTable: any;
  let testMenuItem: any;

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await Order.deleteMany({});
    await Table.deleteMany({});
    await Menu.deleteMany({});

    // Créer une table de test
    testTable = await Table.create({
      number: 1,
      capacity: 4,
      status: 'available',
      position: { x: 0, y: 0 },
      shape: 'square'
    });

    // Créer un article de menu de test
    testMenuItem = await Menu.create({
      name: 'Test Item',
      description: 'Test Description',
      price: 10.99,
      category: 'main',
      isAvailable: true
    });
  });

  afterAll(async () => {
    await Order.deleteMany({});
    await Menu.deleteMany({});
    await Table.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/orders', () => {
    it('devrait créer une nouvelle commande', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          tableId: testTable._id,
          items: [{
            menuItem: testMenuItem._id,
            quantity: 2,
            specialInstructions: 'Sans gluten'
          }],
          notes: 'Test commande'
        });

      expect(response.status).toBe(201);
      expect(response.body.table).toBe(testTable._id.toString());
      expect(response.body.items).toHaveLength(1);
      expect(response.body.status).toBe('pending');
    });

    it('ne devrait pas créer une commande pour une table occupée', async () => {
      // Mettre la table en statut occupé
      testTable.status = 'occupied';
      await testTable.save();

      const response = await request(app)
        .post('/api/orders')
        .send({
          tableId: testTable._id,
          items: [{
            menuItem: testMenuItem._id,
            quantity: 1
          }]
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('devrait récupérer une commande par son ID', async () => {
      // Créer une commande de test
      const order = await Order.create({
        table: testTable._id,
        items: [{
          menuItem: testMenuItem._id,
          quantity: 1,
          status: 'pending',
          priceAtTime: testMenuItem.price
        }],
        status: 'pending',
        totalAmount: testMenuItem.price
      });

      const response = await request(app)
        .get(`/api/orders/${order._id}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(order._id.toString());
    });

    it('devrait retourner 404 si la commande n\'existe pas', async () => {
      const response = await request(app)
        .get(`/api/orders/${new mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('devrait mettre à jour le statut d\'une commande', async () => {
      const order = await Order.create({
        table: testTable._id,
        items: [{
          menuItem: testMenuItem._id,
          quantity: 1,
          status: 'pending',
          priceAtTime: testMenuItem.price
        }],
        status: 'pending',
        totalAmount: testMenuItem.price
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: 'confirmed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
    });

    it('ne devrait pas permettre une transition de statut invalide', async () => {
      const order = await Order.create({
        table: testTable._id,
        items: [{
          menuItem: testMenuItem._id,
          quantity: 1,
          status: 'pending',
          priceAtTime: testMenuItem.price
        }],
        status: 'pending',
        totalAmount: testMenuItem.price
      });

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: 'paid' });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/orders/:id/items/:itemId/status', () => {
    it('devrait mettre à jour le statut d\'un article', async () => {
      const order = await Order.create({
        table: testTable._id,
        items: [{
          menuItem: testMenuItem._id,
          quantity: 1,
          status: 'pending',
          priceAtTime: testMenuItem.price
        }],
        status: 'pending',
        totalAmount: testMenuItem.price
      });

      const itemId = order.items[0]._id.toString();

      const response = await request(app)
        .patch(`/api/orders/${order._id}/items/${itemId}/status`)
        .send({ status: 'preparing' });

      expect(response.status).toBe(200);
      expect(response.body.items[0].status).toBe('preparing');
    });
  });
}); 