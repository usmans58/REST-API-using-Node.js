const express = require("express");
const app = express();
const port = 8000;

const users = require("./MOCK_DATA.json");

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user= users.find(user =>user.id === id);
    return res.json(user);


});



app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
);
