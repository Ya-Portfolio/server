import app from "./app.js";
import { connectToDatabase } from "./db/db.js";
import { config } from "dotenv";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";

config();
const numCPUs = availableParallelism();

connectToDatabase(process.env.MONGODB_URI)
  .then(() => {
    if (cluster.isPrimary) {
      console.log(`CPU: Primary ${process.pid} is running`);
      for (let i = 0; i < numCPUs; i++) cluster.fork();
      cluster.on("exit", (worker, code, signal) => {
        console.log(`CPU: Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      app.listen(process.env.PORT, () => {
        console.log(
          `Success: Server started on http://localhost:${process.env.PORT}`
        );
      });
      console.log(`CPU: Worker ${process.pid} started`);
    }
  })
  .catch((error) => {
    console.log(`Failure: Unable to start the server`);
    console.log(error);
  });
