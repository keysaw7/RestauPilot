import request from 'supertest';
import app from '../../app';
import Menu from '../../models/Menu';
import mongoose from 'mongoose';

describe('Menu Controller', () => {
  beforeAll(async () => {
    // Nettoyer la base de données avant les tests
    await Menu.deleteMany({});
  });

  afterAll(async () => {
    await Menu.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/menu', () => {
    it('devrait créer un nouvel article de menu', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'Test Item',
          description: 'Test Description',
          price: 10.99,
          category: 'main',
          isAvailable: true,
          preparationTime: 15,
          ingredients: ['ingrédient 1', 'ingrédient 2'],
          allergens: ['allergène 1']
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Item');
      expect(response.body.price).toBe(10.99);
      expect(response.body.category).toBe('main');
    });

    it('ne devrait pas créer un article avec des données invalides', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          name: 'Test Item',
          // description manquante
          price: -10, // prix invalide
          category: 'invalid_category' // catégorie invalide
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/menu', () => {
    it('devrait récupérer tous les articles', async () => {
      // Créer quelques articles de test
      await Menu.create([
        {
          name: 'Item 1',
          description: 'Description 1',
          price: 10,
          category: 'starter',
          isAvailable: true
        },
        {
          name: 'Item 2',
          description: 'Description 2',
          price: 15,
          category: 'main',
          isAvailable: false
        }
      ]);

      const response = await request(app)
        .get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait filtrer les articles par catégorie', async () => {
      const response = await request(app)
        .get('/api/menu?category=starter');

      expect(response.status).toBe(200);
      expect(response.body.every((item: any) => item.category === 'starter')).toBe(true);
    });

    it('devrait filtrer les articles disponibles', async () => {
      const response = await request(app)
        .get('/api/menu?available=true');

      expect(response.status).toBe(200);
      expect(response.body.every((item: any) => item.isAvailable === true)).toBe(true);
    });
  });

  describe('GET /api/menu/:id', () => {
    it('devrait récupérer un article par son ID', async () => {
      const menuItem = await Menu.create({
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
        category: 'main',
        isAvailable: true
      });

      const response = await request(app)
        .get(`/api/menu/${menuItem._id}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(menuItem._id.toString());
    });

    it('devrait retourner 404 si l\'article n\'existe pas', async () => {
      const response = await request(app)
        .get(`/api/menu/${new mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('devrait mettre à jour un article', async () => {
      const menuItem = await Menu.create({
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
        category: 'main',
        isAvailable: true
      });

      const response = await request(app)
        .put(`/api/menu/${menuItem._id}`)
        .send({
          name: 'Updated Item',
          price: 15.99
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Item');
      expect(response.body.price).toBe(15.99);
    });
  });

  describe('PATCH /api/menu/:id/toggle-availability', () => {
    it('devrait basculer la disponibilité d\'un article', async () => {
      const menuItem = await Menu.create({
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
        category: 'main',
        isAvailable: true
      });

      const response = await request(app)
        .patch(`/api/menu/${menuItem._id}/toggle-availability`);

      expect(response.status).toBe(200);
      expect(response.body.isAvailable).toBe(false);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('devrait supprimer un article', async () => {
      const menuItem = await Menu.create({
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
        category: 'main',
        isAvailable: true
      });

      const response = await request(app)
        .delete(`/api/menu/${menuItem._id}`);

      expect(response.status).toBe(204);

      // Vérifier que l'article a bien été supprimé
      const deletedItem = await Menu.findById(menuItem._id);
      expect(deletedItem).toBeNull();
    });
  });
}); 