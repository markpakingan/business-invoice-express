// this is the companies.js file inside the routes folder

const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")

router.get("/", async (req, res, next)=> {

    try {
        const companiesQuery = await db.query("SELECT * FROM companies")
        return res.json({companies: companiesQuery.rows})
    } catch (err){
        return next(err)
    }
});

router.get("/:code", async (req, res, next)=> {

    try {
        const companiesQuery = await db.query(
            "SELECT code, name FROM companies where code= $1", [req.params.code]);

        if (companiesQuery.rows.length === 0){
            let notFoundError = new Error(`There is no company with code "${req.params.code}"`);
            notFoundError.status = 404;
            throw notFoundError;
        }
        return res.json({ companies: companiesQuery.rows[0]})
    } catch (err){
        return next(err)
    }
});


router.post("/", async (req, res, next)=>{
    try {

        const {code, name, description} = req.body;

        const result = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)
        RETURNING code, name, description`, [code, name, description]);

        return res.status(201).json({companies : result.rows[0]});

    } catch(err){
        return next(err)
    }
})



module.exports = router;