const inventoryService = require('./inventory.service');

exports.getAllInventory = async (req, res) => {
  try {
    const inventoryData = await inventoryService.getAllInventory();
    res.status(200).json(inventoryData);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'An error occurred while fetching inventory' });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await inventoryService.getInventoryItemById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'An error occurred while fetching inventory item' });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const updatedInventory = await inventoryService.updateInventory(req);

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ message: 'An error occurred while updating your inventory!' });
  }
};
