
const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

router.get("/", (req, res, next)=> {
    res.send("hello!")
})