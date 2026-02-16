let inventoryTransactionData = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2026-02-15T17:30:00Z",
    foster_user_id: "550e8400-e29b-41d4-a716-446655440100",
    created_by_staff_user_id: "550e8400-e29b-41d4-a716-446655440200",
    item_id: "550e8400-e29b-41d4-a716-446655440300",
    inventory_id: "550e8400-e29b-41d4-a716-446655440400",
    qty_out: 5,
    status: "pending",
    type: "distribution",
    notes: "Dog food for new foster placement",
    return_date: "2026-03-15"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    created_at: "2026-02-14T10:15:00Z",
    foster_user_id: "550e8400-e29b-41d4-a716-446655440101",
    created_by_staff_user_id: "550e8400-e29b-41d4-a716-446655440201",
    item_id: "550e8400-e29b-41d4-a716-446655440301",
    inventory_id: "550e8400-e29b-41d4-a716-446655440401",
    qty_out: 2,
    status: "complete",
    type: "loan",
    notes: "Cat carriers for vet visit",
    return_date: "2026-02-16"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    created_at: "2026-02-13T14:45:00Z",
    foster_user_id: "550e8400-e29b-41d4-a716-446655440102",
    created_by_staff_user_id: "550e8400-e29b-41d4-a716-446655440202",
    item_id: "550e8400-e29b-41d4-a716-446655440302",
    inventory_id: "550e8400-e29b-41d4-a716-446655440402",
    qty_out: 10,
    status: "returned",
    type: "distribution",
    notes: "Puppy training pads",
    return_date: null
  }
];

exports.findAll = async () => {
  return inventoryTransactionData;
};

exports.findById = async (id) => {
  return inventoryTransactionData.find(item => item.id === id);
};

exports.create = async (newTransaction) => {

  const newId = `550e8400-e29b-41d4-a716-44665544${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const newRecord = {
    id: newId,
    created_at: new Date().toISOString(),
    ...newTransaction,
  };
  inventoryTransactionData.push(newRecord);
  return newRecord;
}
