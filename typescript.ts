import express, { Express, Request, Response } from "express";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerOptions';

const fs = require("fs");
const app: Express = express();
const port: number = 8000;

interface User {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  id: number;
}

const users: User[] = require("../MOCK_DATA.json");
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", (req: Request, res: Response) => {
  return res.json(users);
});

app.get("/users/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
});

interface PatchUserRequestBody {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  id?: number;
}


app.patch("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body: PatchUserRequestBody = req.body;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex !== -1) {
    const existingUser = users[userIndex];

    if (existingUser) {
      // Check and apply type-safe updates
      if (typeof body.first_name === 'string') {
        existingUser.first_name = body.first_name;
      } else if (body.first_name !== undefined) {
        return res.status(400).json({ error: "Invalid type for 'first_name'" });
      }

      if (typeof body.last_name === 'string') {
        existingUser.last_name = body.last_name;
      } else if (body.last_name !== undefined) {
        return res.status(400).json({ error: "Invalid type for 'last_name'" });
      }

      if (typeof body.email === 'string') {
        existingUser.email = body.email;
      } else if (body.email !== undefined) {
        return res.status(400).json({ error: "Invalid type for 'email'" });
      }

      if (typeof body.gender === 'string') {
        existingUser.gender = body.gender;
      } else if (body.gender !== undefined) {
        return res.status(400).json({ error: "Invalid type for 'gender'" });
      }

      if (typeof body.id === 'number') {
        existingUser.id = body.id;
      } else if (body.id !== undefined) {
        return res.status(400).json({ error: "Invalid type for 'id'" });
      }
    }

    fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err:any) => {
      if (err) {
        console.log(err);
      }
    });
  }
  return res.json(users);
});
app.delete("/users/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id);

  // Check if id is a valid number
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user ID provided" });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    for (let i = userIndex; i < users.length; i++) {
      users[i].id = i + 1;
    }

    fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err: any) => {
      if (err) {
        console.log(err);
      }
    });

    return res.json(users);
  } else {
    return res.status(404).json({ error: "User not found" });
  }
});


app.post("/users", (req: Request, res: Response) => {
  const body: User = req.body;

  // Check if the received data adheres to the User interface
  if (
    typeof body.first_name === 'string' &&
    typeof body.last_name === 'string' &&
    typeof body.email === 'string' &&
    typeof body.gender === 'string'  ) {
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err: any) => {
      if (err) {
        console.log(err);
      }
    });
    return res.json(users);
  } else {
    return res.status(400).json({ error: "Invalid user data" });
  }
});


const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
);
