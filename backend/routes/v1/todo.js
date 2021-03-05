const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

router.route("/b")
  .get((req, res) => {
    try {
      const todos = fs.readdirSync("./todos")
        .filter((id) => path.extname(id) === ".json")
        .map((id) => JSON.parse(fs.readFileSync(`./todos/${id}`, "utf8")));

      res.send(todos);
    } catch (err) {
      console.log(err);

      res.status(404).send("Todos not found");
    }
  })
  .post((req, res) => {
    try {
      const { body } = req;
      const id = uuidv4();

      if (Object.entries(body).length === 0) {
        res.status(400).send("Todo cannot be blank");
      } else {
        const newTodo = { id, ...body };

        fs.writeFileSync(`./todos/${id}.json`,
          JSON.stringify(newTodo, null, 4)
        );

        res.send(id);
      }
    } catch (err) {
      console.log(err);

      res.send(err);
    }
  })
  .delete((req, res) => {
    try {
      const todos = fs.readdirSync("./todos")
        .filter((id) => path.extname(id) === ".json");

      todos.forEach((todo) => {
        fs.unlinkSync(`./todos/${todo}`);
      });

      res.send("Todos deleted");
    } catch (err) {
      console.log(err);

      res.status(404).send("Todos not found");
    }
  });

router.route("/b/done")
  .delete((req, res) => {
    try {
      const doneTodos = fs.readdirSync("./todos")
        .filter((id) => path.extname(id) === ".json")
        .map((id) => JSON.parse(fs.readFileSync(`./todos/${id}`, "utf8")))
        .filter((todo) => todo.done);

      doneTodos.forEach((todo) => {
        fs.unlinkSync(`./todos/${todo.id}.json`);
      })

      res.send("All done todos are deleted");
    } catch (err) {
      console.log(err);

      res.status(400).send("Can't find todos");
    }
  });

router.route("/b/:id")
  .get((req, res) => {
    const { id } = req.params;

    try {
      const bin = fs.readFileSync(`./todos/${id}.json`, "utf8");

      res.send(bin);
    } catch (err) {
      console.log(err);

      res.status(404).send("Todo not found");
    }
  })
  .put((req, res) => {
    const { body } = req;
    const { id } = req.params;

    if (Object.entries(body).length === 0) {
      res.status(400).send("Todo cannot be blank");
    }
    else {
      try {
        fs.writeFileSync(`./todos/${id}.json`, JSON.stringify(body, null, 4));

        res.send("Todo updated :)");
      } catch (err) {
        console.log(err);

        res.status(400).send("Can't update todo");
      }
    }
  })
  .delete((req, res) => {
    try {
      const { id } = req.params;

      fs.unlinkSync(`./todos/${id}.json`);

      res.send("Todo deleted :(");
    } catch (err) {
      console.log(err);

      res.status(400).send("Can't delete todo");
    }
  });

module.exports = router;
