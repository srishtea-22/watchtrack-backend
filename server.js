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
  // const { userId, videoId, segment, videoLength, currentProgress } = req.body;
    const { userId, videoId, lastWatched, videoLength } = req.body;
  try {
    let userProgress = await UserProgress.findOne({ userId, videoId });

    if (!userProgress) {
        userProgress = new UserProgress({
            userId,
            videoId,
            lastWatched,
            videoLength
        });
    } else {
        userProgress.lastWatched = lastWatched;
    }

    await userProgress.save();
    res.status(200).json({message: "Progress updated successfully"});

} catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Failed to update progress" });
}
});

app.listen(PORT, () => {
    console.log("server started");
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
