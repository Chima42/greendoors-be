"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
require('dotenv').config();
const dynamodb_1 = __importDefault(require("aws-sdk/clients/dynamodb"));
const cors_1 = __importDefault(require("cors"));
const _tableName = "greendoors";
const x = new dynamodb_1.default.DocumentClient({
    region: "eu-west-2",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});
const app = express();
app.use(express.json());
app.use((0, cors_1.default)());
const port = 4000;
app.get("/health-check", (req, res) => {
    res.json("Server is working");
});
app.post("/record/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    record.RecordId = +Math.random().toString().substring(2, 8);
    try {
        yield x.put({
            TableName: _tableName,
            Item: record
        }).promise();
        res.status(201).send();
    }
    catch (e) {
        if (e.code === "ValidationException") {
            res.status(400).send({
                success: false,
                errorType: "ValidationException",
                message: e.message
            });
        }
        res.status(500).send({
            success: false,
            errorType: e.code,
            message: e.message
        });
    }
}));
app.get("/record/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield x.scan({
            TableName: _tableName
        }).promise();
        res.send({
            items: result.Items,
            error: {
                status: false,
                message: undefined
            }
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            errorType: e.code,
            message: e.message
        });
    }
}));
app.put("/record/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield x.put({
            TableName: _tableName,
            Item: {
                colour: data === null || data === void 0 ? void 0 : data.colour,
                make: data === null || data === void 0 ? void 0 : data.make,
                code: data === null || data === void 0 ? void 0 : data.code,
                name: data === null || data === void 0 ? void 0 : data.name,
                RecordId: data.recordId
            }
        }).promise();
        res.status(204).send();
    }
    catch (e) {
        if (e.code === "ValidationException") {
            res.status(400).send({
                success: false,
                errorType: "ValidationException",
                message: e.message
            });
        }
        res.status(500).send({
            success: false,
            errorType: e.code,
            message: e.message
        });
    }
}));
app.delete("/record/:id/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield x.delete({
            TableName: _tableName,
            Key: {
                RecordId: Number(req.params.id)
            }
        }).promise();
        res.status(200).send();
    }
    catch (e) {
        if (e.code === "ValidationException") {
            res.status(400).send({
                success: false,
                errorType: "ValidationException",
                message: e.message
            });
        }
        else {
            res.status(500).send({
                success: false,
                errorType: e.code,
                message: e.message
            });
        }
    }
}));
app.listen(port, () => {
    return console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map