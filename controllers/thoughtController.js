const Thought = require("../models/Thought");
const User = require("../models/User");

const thoughtController = {
  // All thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate("reactions")
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Individual thought
  findThoughtById({ params }, res) {
    Thought.findById({ _id: params.id })
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Create a new thought
  newThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          return res.status(404).json({
            message:
              "Created a thought, but could not find the user with this ID",
          });
        }
        res.json({ message: "Thought created successfully" });
      })
      .catch((err) => res.status(500).json(err));
  },
  // Delete a previous thought
  deleteThought({ params }, res) {
    Thought.findByIdAndDelete({ _id: params.id })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res
            .status(404)
            .json({ message: "No thought with this id found" });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((userData) => {
        if (!userData) {
          res.status(404).json({
            message:
              "Thought deleted, but it was not associated to a valid user",
          });
        }
        res.json({ message: "Thought successfully deleted" });
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update a previous thought
  updateThought({ params, body }, res) {
    Thought.findByIdAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(thoughtData);
      })
      .catch((err) => res.json(err));
  },
  // Add comment to a thought
  addReaction({ params, body }, res) {
    Thought.findByIdAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((thought) => {
        if (!thought) {
          res
            .status(404)
            .json({ message: "Couldn't find a thought with that ID" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
  // Remove the comment
  removeReaction({ params }, res) {
    Thought.findByIdAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
      .then((thought) => {
        if (!thought) {
          res
            .status(404)
            .json({ message: "Couldn't find a thought with that ID" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
