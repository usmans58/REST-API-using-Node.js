"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOptions_1 = __importDefault(require("./swaggerOptions"));
const fs = require("fs");
const app = (0, express_1.default)();
const port = 8000;
const users = require("../MOCK_DATA.json");
//app.use(express.urlencoded({ extended: true }));
app.use(express_1.default.json());
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
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
        const existingUser = users[userIndex];
        if (existingUser) {
            // Check and apply type-safe updates
            if (typeof body.first_name === 'string') {
                existingUser.first_name = body.first_name;
            }
            else if (body.first_name !== undefined) {
                return res.status(400).json({ error: "Invalid type for 'first_name'" });
            }
            if (typeof body.last_name === 'string') {
                existingUser.last_name = body.last_name;
            }
            else if (body.last_name !== undefined) {
                return res.status(400).json({ error: "Invalid type for 'last_name'" });
            }
            if (typeof body.email === 'string') {
                existingUser.email = body.email;
            }
            else if (body.email !== undefined) {
                return res.status(400).json({ error: "Invalid type for 'email'" });
            }
            if (typeof body.gender === 'string') {
                existingUser.gender = body.gender;
            }
            else if (body.gender !== undefined) {
                return res.status(400).json({ error: "Invalid type for 'gender'" });
            }
            if (typeof body.id === 'number') {
                existingUser.id = body.id;
            }
            else if (body.id !== undefined) {
                return res.status(400).json({ error: "Invalid type for 'id'" });
            }
        }
        fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    return res.json(users);
});
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
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
        fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.json(users);
    }
    else {
        return res.status(404).json({ error: "User not found" });
    }
});
app.post("/users", (req, res) => {
    const body = req.body;
    // Check if the received data adheres to the User interface
    if (typeof body.first_name === 'string' &&
        typeof body.last_name === 'string' &&
        typeof body.email === 'string' &&
        typeof body.gender === 'string') {
        users.push(Object.assign(Object.assign({}, body), { id: users.length + 1 }));
        fs.writeFile("../MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.log(err);
            }
        });
        return res.json(users);
    }
    else {
        return res.status(400).json({ error: "Invalid user data" });
    }
});
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.listen(port, () => console.log(`Server is running on port http://localhost:${port}`));
