import axios from 'axios';

class AdresseService {
  async searchAddress(query) {
    try {
      const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}`);
      return response.data.features;
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses :", error);
      throw error;
    }
  }
}

export default new AdresseService();
