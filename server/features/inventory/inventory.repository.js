let inventoryData = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    item_id: '550e8400-e29b-41d4-a716-446655440004',
    quantity: 5,
    expiration_date: new Date('2026-06-15'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    item_id: '550e8400-e29b-41d4-a716-446655448222',
    quantity: 20,
    expiration_date: new Date('2026-03-30'),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    item_id: '550e8400-e29b-41d4-a716-446655444234',
    quantity: 15,
    expiration_date: new Date('2026-08-20'),
  },
];

exports.findAll = async () => {
  return inventoryData;
};

exports.update = async (id, data) => {
  const index = inventoryData.findIndex(item => item.id === id);

  if (index === -1) {
    return null;
  }

  const updatedRecord = {
    ...inventoryData[index],
    ...data,
  };

  inventoryData[index] = updatedRecord;

  return updatedRecord;
};
