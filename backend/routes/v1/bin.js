const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

router.route("/b")
  .get((req, res) => {
    const bins = fs.readdirSync("./bins")
      .filter((id) => path.extname(id) === ".json")
      .map((id) => JSON.parse(fs.readFileSync(`./bins/${id}`, "utf8")));
    res.send(bins);
  })
  .post((req, res) => {
    const { body } = req;

    try {
      fs.writeFileSync(`./bins/${uuidv4()}.json`, JSON.stringify(body, null, 4));
      res.send("Bin added!");
    } catch (err) {
      console.log(err);
    }
  });

router.route("/b/:id")
  .get((req, res) => {
    const { id } = req.params;

    try {
      const bin = fs.readFileSync(`./bins/${id}.json`, "utf8");
      res.send(bin);
    } catch (err) {
      console.log(err);
    }
  })
  .put((req, res) => {
    const { body } = req;
    const { id } = req.params;

    try {
      fs.writeFileSync(`./bins/${id}.json`, JSON.stringify(body, null, 4));
      res.send("Bin updated :)");
    } catch (err) {
      console.log(err);
    }
  })
  .delete((req, res) => {
    const { id } = req.params;

    try {
      fs.unlinkSync(`./bins/${id}.json`);
      res.send("Bin deleted :(");
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;