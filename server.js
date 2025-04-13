require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const UserProgress = require("./models/userProgress");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/api/users", async (req, res) => {
    const { username } = req.body;

    try {
        let user = await User.findOne({ username });
    
        if (!user) {
          user = new User({ username });
          await user.save();
        }
    
        res.status(200).json({ message: "OK", user });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});

app.post("/api/progress", async (req, res) => {
    const { userId, videoId, lastWatched, videoLength, watchedSegments } = req.body;
  try {
    let userProgress = await UserProgress.findOne({ userId, videoId });

    if (!userProgress) {
        userProgress = new UserProgress({
            userId,
            videoId,
            lastWatched,
            videoLength,
            watchedSegments
        });
    } else {
        userProgress.lastWatched = lastWatched;
        userProgress.watchedSegments = mergeSegments([...userProgress.watchedSegments, ...watchedSegments]);
    }
    userProgress.totalProgress = calculateTotalProgress(userProgress.watchedSegments, videoLength);


    await userProgress.save();
    res.status(200).json({message: "Progress updated successfully"});

} catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
}
});

app.get('/api/progress', async (req, res) => {
    const { userId } = req.query;
    
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      return res.json({
        lastWatched: userProgress.lastWatched,
        totalProgress: userProgress.totalProgress
      });
    }
    res.status(404).json({ message: 'Progress not found' });
  });

app.listen(PORT, () => {
    console.log("server started");
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

function mergeSegments(segments) {
    segments.sort((a, b) => a[0] - b[0]);
   
    const merged = [];
   
    for (let current of segments) {
        if (merged.length === 0) {
            merged.push(current);
        }
        else {
            let last = merged[merged.length - 1];
   
            if (current[0] <= last[1]) {
                last[1] = Math.max(last[1], current[1]);
            }
            else {
                merged.push(current);
            }
        }
    }
    return merged;
  }

  function calculateTotalProgress(watchedSegments, videoLength) {
    if (!watchedSegments || watchedSegments.length === 0 || !videoLength) {
      return 0;
    }
  
    let totalWatched = 0;
    for (const segment of watchedSegments) {
      totalWatched += Math.max(0, segment[1] - segment[0]); 
    }
  
    return Math.round((totalWatched / videoLength) * 100);
  }