exports.findAll = async () => {
  return [
    {
      id: '1',
      category: 'crate',
      name: 'Large Plastic Crate',
      brand: 'PetCo',
      description: 'Durable plastic crate for large dogs',
      species: 'dog',
      unit: 'count',
      is_active: true,
      created_at: new Date('2026-01-15'),
    },
    {
      id: '2',
      category: 'food',
      name: 'Premium Dog Food',
      brand: 'Royal Canin',
      description: 'High-protein dry kibble for adult dogs',
      species: 'dog',
      unit: 'lbs',
      is_active: true,
      created_at: new Date('2026-01-10'),
    },
    {
      id: '3',
      category: 'medication',
      name: 'Amoxicillin',
      brand: 'Generic',
      description: 'Antibiotic for bacterial infections',
      species: 'cat',
      unit: 'tablets',
      is_active: true,
      created_at: new Date('2026-02-01'),
    },
  ];
};

exports.findUnique = async (id) => {
  const items = await this.findAll();
  return items.find(item => item.id === id);
}
