require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
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

app.listen(PORT, () => {
    console.log("server started");
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
