const User = require("../models/User");

const userController = {
  // Find all users
  getAllUsers(req, res) {
    User.find({})
      .populate("thoughts")
      .populate("friends")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Create a new user
  newUser({ body }, res) {
    User.create(body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Find an individual user
  findUserById({ params }, res) {
    User.findById({ _id: params.id })
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Update existing user
  updateUser({ params, body }, res) {
    User.findByIdAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },
  // Delete existing user
  deleteUser({ params }, res) {
    User.findByIdAndDelete({ _id: params.id })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No user found" });
          return;
        }
        res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },
  // Add another user as a friend
  addFriend({ params }, res) {
    User.findByIdAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((userData) => {
        if (!userData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(userData);
      })
      .catch((err) => res.json(err));
  },

  // Remove friend
  removeFriend({ params }, res) {
    User.findByIdAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this ID" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
