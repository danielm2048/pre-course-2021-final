const express = require("express");

const app = express();
const port = 5000;

const binRoutes = require("./routes/v1/bin");

app.use(express.json());
app.use("/api", binRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
})