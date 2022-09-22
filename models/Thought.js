const { Schema, model , Types } = require('mongoose');

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

thoughtSchema.virtual("date").get(function (){
  const date = new Date(this.createdAt)
  return `${date.toDateString()} at ${date.toLocaleTimeString()}`
})

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
})


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
