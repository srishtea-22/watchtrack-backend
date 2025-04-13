const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  lastWatched: Number, 
  videoLength: Number,
//  segments: [
//    {
//        start: Number,
//        end: Number
//    }
//  ],
//  totalProgress: {type: Number, default: 0}
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
