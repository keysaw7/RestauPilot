import axios from 'axios';
import { Table } from '../types/table';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api/tables';

export const tableService = {
  // Récupérer toutes les tables
  getAllTables: async (): Promise<Table[]> => {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  },

  // Récupérer une table par son ID
  getTableById: async (id: string): Promise<Table> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Mettre à jour le statut d'une table
  updateTableStatus: async (id: string, status: string): Promise<Table> => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  // Mettre à jour la position d'une table
  updateTablePosition: async (id: string, position: { x: number; y: number }): Promise<Table> => {
    const response = await axios.patch(`${API_URL}/${id}/position`, { position });
    return response.data;
  },

  // Mettre à jour une table (propriétés générales)
  updateTable: async (id: string, tableData: Partial<Omit<Table, "_id">>): Promise<Table> => {
    const response = await axios.patch(`${API_URL}/${id}`, tableData);
    return response.data;
  },

  // Créer une nouvelle table
  createTable: async (table: { 
    number: number; 
    capacity: number; 
    status: string;
    position?: { x: number; y: number };
    shape?: 'square' | 'round' | 'rectangular';
  }): Promise<Table> => {
    console.log("tableService.createTable avec les données:", table);
    const response = await axios.post(`${API_URL}`, table);
    return response.data;
  },

  // Supprimer une table - Version simplifiée
  deleteTable: async (id: string): Promise<{ success: boolean; message: string }> => {
    console.log(`Tentative de suppression de la table avec l'ID: ${id}`);
    
    // Validation simple de l'ID
    if (!id || id === 'undefined') {
      console.error("ID de table non valide pour la suppression");
      throw new Error("ID de table non valide");
    }
    
    try {
      // Utiliser axios pour la requête DELETE
      const response = await axios.delete(`${API_URL}/${id}`);
      console.log(`Table avec l'ID: ${id} supprimée avec succès:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la table avec l'ID: ${id}`, error);
      
      // Gestion d'erreur simplifiée
      if (axios.isAxiosError(error)) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
      
      throw new Error("Erreur lors de la suppression de la table");
    }
  }
}; 