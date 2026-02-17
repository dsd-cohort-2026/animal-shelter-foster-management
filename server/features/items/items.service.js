const itemRepository = require('./items.repository');

exports.getAllItems = async () => {
  const items = await itemRepository.findAll()

  const formattedItems = items.map(item => {
    return {
      id: item.id,
      category: item.category,
      name: item.name,
      brand: item.brand,
      description: item.description,
      species: item.species,
      unit: item.unit,
      is_active: item.is_active,
      created_at: item.created_at,
    };
  });

  return formattedItems;
}

exports.getItemById = async (id) => {
  const item = await itemRepository.findUnique(id);
  if (!item) {
    return null;
  }
  return {
    id: item.id,
    category: item.category,
    name: item.name,
    brand: item.brand,
    description: item.description,
    species: item.species,
    unit: item.unit,
    is_active: item.is_active,
    created_at: item.created_at,
  };
}
