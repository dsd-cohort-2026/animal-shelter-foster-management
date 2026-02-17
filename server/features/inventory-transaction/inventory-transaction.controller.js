const inventoryTransactionService = require('./inventory-transaction.service');

exports.getAllInventoryTransactions = async (req, res) => {
  try {
    const inventoryTransaction = await inventoryTransactionService.getAllInventoryTransactions();
    res.status(200).json(inventoryTransaction);
  } catch (error) {
    console.error("Error fetching inventory transactions:", error);
    res.status(500).json({ message: "An error occurred while fetching inventory transactions" });
  }
}

exports.getInventoryTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryTransaction = await inventoryTransactionService.getInventoryTransactionById(id);
    if (!inventoryTransaction) {
      return res.status(404).json({ message: "Inventory transaction not found" });
    }

    res.status(200).json(inventoryTransaction);
  } catch (error) {
    console.error("Error fetching inventory transaction:", error);
    res.status(500).json({ message: "An error occurred while fetching inventory transaction" });
  }
}

exports.createNewInventoryTransaction = async (req, res) => {
  try {
    const newTransaction = req.body;
    const createdTransaction = await inventoryTransactionService.createNewInventoryTransaction(newTransaction);
    res.status(201).json(createdTransaction);
  } catch (error) {
    console.error("Error creating inventory transaction:", error);
    res.status(500).json({ message: "An error occurred while creating inventory transaction" });
  }
}
