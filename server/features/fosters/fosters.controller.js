const fosterService = require('./fosters.service');

exports.getAllFosters = async (req, res) => {
  try {
    const fosters = await fosterService.getAllFosters();
    res.status(200).json(fosters);
  } catch (error) {
    console.error('Error fetching fosters:', error);
    res.status(500).json({ message: 'An error occurred while fetching fosters' });
  }
};

exports.getFosterById = async (req, res) => {
  try {
    const { id } = req.params;
    const foster = await fosterService.getFosterById(id);
    if (!foster) {
      return res.status(404).json({ message: 'Foster not found' });
    }
    res.status(200).json(foster);
  } catch (error) {
    console.error('Error fetching foster:', error);
    res.status(500).json({ message: 'An error occurred while fetching foster' });
  }
};

exports.createFoster = async (req, res) => {
  try {
    const fosterData = req.body;
    const newFoster = await fosterService.createFoster(fosterData);
    res.status(201).json(newFoster);
  } catch (error) {
    console.error('Error creating foster:', error);
    res.status(500).json({ message: 'An error occurred while creating foster' });
  }
};

exports.updateFoster = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedFoster = await fosterService.updateFoster(id, updates);
    if (!updatedFoster) {
      return res.status(404).json({ message: 'Foster not found' });
    }
    res.status(200).json(updatedFoster);
  } catch (error) {
    console.error('Error updating foster:', error);
    res.status(500).json({ message: 'An error occurred while updating foster' });
  }
};

exports.deleteFoster = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await fosterService.deleteFoster(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Foster not found' });
    }
    res.status(200).json({ message: 'Foster deleted successfully' });
  } catch (error) {
    console.error('Error deleting foster:', error);
    res.status(500).json({ message: 'An error occurred while deleting foster' });
  }
};

exports.getFostersByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const fosters = await fosterService.getFostersByAnimal(animalId);
    res.status(200).json(fosters);
  } catch (error) {
    console.error('Error fetching fosters by animal:', error);
    res.status(500).json({ message: 'An error occurred while fetching fosters by animal' });
  }
};

exports.getFostersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const fosters = await fosterService.getFostersByUser(userId);
    res.status(200).json(fosters);
  } catch (error) {
    console.error('Error fetching fosters by user:', error);
    res.status(500).json({ message: 'An error occurred while fetching fosters by user' });
  }
};
