const { Schema, model , Types } = require('mongoose');

// Schema for reactions
const reactionSchema = new Schema ({
  body: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Schema for thoughts
const thoughtSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      reactionSchema
    ]
  },
  {
    toJSON: {
      virtuals: true
    },
    timestamps: {createdAt: true},
    id: false,
  }
);

// Virtual to format the date
thoughtSchema.virtual("date").get(function (){
  const date = new Date(this.createdAt)
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`
})

// Virtual for total number of reactions
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
})


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
