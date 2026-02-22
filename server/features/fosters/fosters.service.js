const fosterRepository = require('./fosters.repository');

exports.getAllFosters = async () => {
  const fosters = await fosterRepository.findAll();
  return fosters.map(foster => ({
    id: foster.id,
    animalId: foster.animal_id,
    userId: foster.user_id,
    startDate: foster.start_date,
    endDate: foster.end_date,
    status: foster.status,
    notes: foster.notes,
    createdAt: foster.created_at,
    updatedAt: foster.updated_at,
  }));
};

exports.getFosterById = async (id) => {
  const foster = await fosterRepository.findById(id);
  if (!foster) {
    return null;
  }
  return {
    id: foster.id,
    animalId: foster.animal_id,
    userId: foster.user_id,
    startDate: foster.start_date,
    endDate: foster.end_date,
    status: foster.status,
    notes: foster.notes,
    createdAt: foster.created_at,
    updatedAt: foster.updated_at,
  };
};

exports.createFoster = async (fosterData) => {
  const newFoster = await fosterRepository.create({
    animal_id: fosterData.animalId,
    user_id: fosterData.userId,
    start_date: fosterData.startDate,
    end_date: fosterData.endDate,
    status: fosterData.status || 'ACTIVE',
    notes: fosterData.notes,
  });
  return {
    id: newFoster.id,
    animalId: newFoster.animal_id,
    userId: newFoster.user_id,
    startDate: newFoster.start_date,
    endDate: newFoster.end_date,
    status: newFoster.status,
    notes: newFoster.notes,
    createdAt: newFoster.created_at,
    updatedAt: newFoster.updated_at,
  };
};

exports.updateFoster = async (id, updates) => {
  const existing = await fosterRepository.findById(id);
  if (!existing) {
    return null;
  }
  const updated = await fosterRepository.update(id, {
    animal_id: updates.animalId,
    user_id: updates.userId,
    start_date: updates.startDate,
    end_date: updates.endDate,
    status: updates.status,
    notes: updates.notes,
  });
  return {
    id: updated.id,
    animalId: updated.animal_id,
    userId: updated.user_id,
    startDate: updated.start_date,
    endDate: updated.end_date,
    status: updated.status,
    notes: updated.notes,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  };
};

exports.deleteFoster = async (id) => {
  const existing = await fosterRepository.findById(id);
  if (!existing) {
    return null;
  }
  return await fosterRepository.delete(id);
};

exports.getFostersByAnimal = async (animalId) => {
  const fosters = await fosterRepository.findByAnimalId(animalId);
  return fosters.map(foster => ({
    id: foster.id,
    animalId: foster.animal_id,
    userId: foster.user_id,
    startDate: foster.start_date,
    endDate: foster.end_date,
    status: foster.status,
    notes: foster.notes,
    createdAt: foster.created_at,
    updatedAt: foster.updated_at,
  }));
};

exports.getFostersByUser = async (userId) => {
  const fosters = await fosterRepository.findByUserId(userId);
  return fosters.map(foster => ({
    id: foster.id,
    animalId: foster.animal_id,
    userId: foster.user_id,
    startDate: foster.start_date,
    endDate: foster.end_date,
    status: foster.status,
    notes: foster.notes,
    createdAt: foster.created_at,
    updatedAt: foster.updated_at,
  }));
};
