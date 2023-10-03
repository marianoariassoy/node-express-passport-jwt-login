import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://santo:santo@cluster0.8ix6f.mongodb.net/?retryWrites=true&w=majority"
  )

  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
