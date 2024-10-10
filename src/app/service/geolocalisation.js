class geolocalisation{
    async Getlocalisation() {
        try {
            const response = await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${query}`);
            setSuggestions(response.data.features);
          } catch (error) {
            console.error("Erreur lors de la récupération des adresses :", error);
          } finally {
            setLoading(false);
          }
    }

}