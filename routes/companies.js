// this is the companies.js file inside the routes folder

const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

router.get("/hello", async (req, res, next)=> {

    try {
        const companiesQuery = await db.query("SELECT * FROM companies")
        return res.json({companies: companiesQuery.rows})
    } catch (err){
        return next(err)
    }
});


module.exports = router;