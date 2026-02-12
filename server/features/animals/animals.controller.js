const animalService = require('./animals.service');

exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await animalService.getAllAnimals();
    res.status(200).json(animals);
  } catch (error) {
    console.log("Error fetching animals:", error);
    res.status(500).json({ message: "An error occurred while fetching animals", error: error.message });
  }
}