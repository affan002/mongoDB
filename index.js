const express = require('express');
const bcrypt = require('bcrypt');
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


    // both callback and await works 
    const hashedPassword = await bcrypt.hash(password, 5)
    console.log(hashedPassword)

    await UserModel.create({
        email: email,
        password: hashedPassword,
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
    })

    if (!user) {
        res.status(403).json({
            message: "user doesnot exist"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password)


    if (passwordMatch) {
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


app.post("/todo", authenticate, async function(req, res) {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        title: title,
        done: done,
        id: userId
    })

    res.json({
        message: "Todo created"
    })
});


app.get("/todos", authenticate, async function(req, res) {
    const userId = req.userId;

    const Todos = await TodoModel.find({
        id: userId
    })

    res.json({
        Todos
    })
});

app.listen(3000);