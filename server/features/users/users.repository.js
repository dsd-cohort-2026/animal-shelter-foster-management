exports.findAll = async () => {
  return [
    { id: 1, first_name: "john", last_name: "doe", email: "john@example.com", address: "123 Main St, Rancho Santa Margarita, CA 92688", imageUrl: "https://placehold.co/150x150", role: "USER" },
    { id: 2, first_name: "jane", last_name: "doe", email: "jane@example.com", address: "123 Tree Dr, Rancho Santa Margarita, CA 92688", imageUrl: "https://placehold.co/150x150", role: "STAFF" },
  ];
};

exports.findUnique = async (id) => {
  const users = await this.findAll();
  return users.find(user => user.id === parseInt(id));
};
