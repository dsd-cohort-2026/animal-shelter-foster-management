const userRepository = require('./users.repository');

const capitalize = (str) =>
  typeof str === 'string' && str.length > 0
    ? str[0].toUpperCase() + str.slice(1).toLowerCase()
    : '';

exports.getAllUsers = async () => {
  const users = await userRepository.findAll();
  return users.map(user => ({
    id: user.id,
    first_name: capitalize(user.first_name),
    last_name: capitalize(user.last_name),
    email: user.email,
    address: user.address,
    imageUrl: user.imageUrl,
    role: user.role
  }));
};

exports.getUserById = async (id) => {
  const user = await userRepository.findUnique(id);

  return {
    id: user.id,
    first_name: capitalize(user.first_name),
    last_name: capitalize(user.last_name),
    email: user.email,
    address: user.address,
    imageUrl: user.imageUrl,
    role: user.role
  };
};
