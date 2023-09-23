"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
require('dotenv').config();
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const x = new dynamodb_1.default.DocumentClient({
    region: "eu-west-2",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});
x.get({
    TableName: "greendoors",
    Key: {
        RecordId: 0
    }
}).promise().then(x => {
    console.log(x);
});
var app = express();
const port = 4000;
app.get("/", (req, res) => {
    res.json("Server is working");
});
app.post("record/save", (req, res) => {
    const record = req.body;
    // save
    res.send("Hello World!");
});
app.get("/record/list", (req, res) => {
    const record = req.body;
    // get
    res.send("Hello World!");
});
app.patch("/record/edit", (req, res) => {
    const record = req.body;
    // edit
    res.send("Hello World!");
});
app.delete("/record/:id", (req, res) => {
    const record = req.body;
    // delete
    res.send("Hello World!");
});
app.listen(port, () => {
    return console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map