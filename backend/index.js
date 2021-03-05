const express = require("express");

const app = express();
const port = 5000;

const todoRoutes = require("./routes/v1/todo");
const delay = require("./middleware/delay");

app.use(express.json());
app.use(delay);
app.use("/api", todoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})