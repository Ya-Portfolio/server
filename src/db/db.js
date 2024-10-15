import mongoose from "mongoose";

async function connectToDatabase(url) {
  try {
    await mongoose.connect(url);
    console.log(`Success: Connected to database`);
  } catch (error) {
    console.log(`Failure: Unable to connect to database`);
    console.log(error);
    process.exit(1);
  }
}

export { connectToDatabase };
