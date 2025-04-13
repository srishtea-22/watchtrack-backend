const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  lastWatched: Number, 
  videoLength: Number,
  watchedSegments: [[Number, Number]],
//  totalProgress: {type: Number, default: 0}
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
