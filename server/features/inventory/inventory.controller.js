const inventoryService = require('./inventory.service');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await inventoryService.getAllInventory();
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "An error occurred while fetching inventory" });
  }
}

exports.getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await inventoryService.getInventoryItemById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({ message: "An error occurred while fetching inventory item" });
  }
}

exports.updateInventoryItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = "550e8400-e29b-41d4-a716-446655440202";

    const inventoryItem = await inventoryService.getInventoryItemById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const updatedInventory = await inventoryService.updateInventoryItemQuantity(id, quantity, userId);

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Error updating inventory item quantity:", error);
    res.status(500).json({ message: "An error occurred while updating inventory item quantity" });
  }
}
