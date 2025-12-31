// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require("mongoose");
const URI =
  "mongodb+srv://makniahmed:makniahmed@cluster0.81jofyt.mongodb.net/casadimoda?appName=Cluster0";

async function test() {
  try {
    console.log("Connecting to:", URI);
    await mongoose.connect(URI);
    console.log("SUCCESS!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("FAILURE:", err.message);
  }
}

test();
