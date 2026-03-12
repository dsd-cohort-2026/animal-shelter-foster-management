const userService = require('./users.service');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.role !== 'STAFF' && requester.id !== id) {
      return res.status(403).json({ message: 'You are not permitted to access this user' });
    }

    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
  }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
}
