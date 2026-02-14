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
    const inventoryItem = await inventoryService.getInventoryById(id);
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
    const inventoryItem = await inventoryService.getInventoryById(id);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    inventoryItem.quantity = quantity;

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "An error occurred while updating inventory item quantity" });
  }
}
