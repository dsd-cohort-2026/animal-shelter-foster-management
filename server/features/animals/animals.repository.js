exports.findAll = async () => {
  // TODO: this will connect to our actual DB; 
  return [
    { id: 1, name: "buddy", species: "Dog" },
    { id: 2, name: "mittens", species: "Cat" },
  ];
};
