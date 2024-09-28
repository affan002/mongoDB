const express = require('express');
const {UserModel, TodoModel} = require("./db")
const {authenticate, JWT_SECRET} = require("./authenticate")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")


mongoose.connect("mongodb+srv://muhammadaffan002ma:eo7JJbDA1ivAI8Ey@cluster0.kjx3l.mongodb.net/todo-app")
const app = express();
app.use(express.json())

app.post("/signup", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({
        email: email,
        password: password,
        name: name,
    })

    res.json({
        message: "you have signed in"
    })
});

app.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password,
    })


    if (user) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_SECRET);
        res.json({
            token: token,
        })
    } else {
        res.status(403).send({
            message: "incorrect credentials"
        })
    }

});


app.post("/todo", authenticate, function(req, res) {
    const userId = req.userId;

    res.json({
        userId
    })
});


app.get("/todos", authenticate, function(req, res) {
    const userId = req.userId;

    res.json({
        userId
    })
});

app.listen(3000);