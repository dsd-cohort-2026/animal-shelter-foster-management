const itemService = require('./items.service');

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "An error occurred while fetching items" });
  }
}

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemService.getItemById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
