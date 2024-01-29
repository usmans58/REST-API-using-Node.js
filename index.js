const express = require("express");
const fs=require("fs");
const app = express();
const port = 8000;

const users = require("./MOCK_DATA.json");
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});
app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const user = users.find((user) => user.id === id);
    const index = users.indexOf(user);
    users[index] = { ...user, ...body };
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){
            console.log(err);
        }
    })
    return res.json(users);
});
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);

        for (let i = userIndex; i < users.length; i++) {
            users[i].id = i + 1;
        }

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log(err);
            }
        });

        return res.json(users);
    } else {
        return res.status(404).json({ error: "User not found" });
    }
});


app.post("/users", (req, res) => {
    const body = req.body;
    console.log(body);
    users.push({...body, id: users.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){
            console.log(err);
        }
    })
    return res.json(users);
});

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
);
