const {
  getAllUsers,
  newUser,
  findUserById,
  deleteUser,
  addFriend,
  removeFriend,
  updateUser,
} = require("../controllers/userController");

const {
  getAllThoughts,
  newThought,
  findThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../controllers/thoughtController");

const router = require("express").Router();

// None of the routes have any other prefixes to simplify them

router.route("/api/users").get(getAllUsers).post(newUser);

router
  .route("/api/users/:id")
  .get(findUserById)
  .delete(deleteUser)
  .put(updateUser);

router
  .route("/api/:userId/friends/:friendId")
  .post(addFriend)
  .delete(removeFriend);

router.route("/api/thoughts").get(getAllThoughts).post(newThought);

router
  .route("/api/thoughts/:id")
  .get(findThoughtById)
  .put(updateThought)
  .delete(deleteThought);

router.route("/api/thoughts/:thoughtId/reactions").post(addReaction);

router
  .route("/api/thoughts/:thoughtId/reactions/:reactionId")
  .delete(removeReaction);

module.exports = router;
