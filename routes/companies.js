// this is the companies.js file inside the routes folder

const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")
const slugify = require("slugify");



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

        let {name, description} = req.body;
        let code = slugify(name, {lower: true});

        const result = await db.query(
        `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)
        RETURNING code, name, description`, [code, name, description]);

        return res.status(201).json({companies : result.rows[0]});

    } catch(err){
        return next(err)
    }
})

router.patch("/:code", async (req, res, next) => {

    try{
        
        if("code" in req.body){
            throw new ExpressError("Updating 'code' is not allowed", 400)
        }

        const { name, description} = req.body;

        const result = await db.query(
            `UPDATE companies SET name= $1, description = $2 WHERE code = $3
            RETURNING code, name, description`, 
            [name, description, req.params.code]
        );

        if (result.rows.length === 0){
            throw new ExpressError(`There is no company with code of '${req.params.id}`, 404)
        }

        return res.json({ companies: result.rows[0]});

    } catch (err) {
        return next(err)
    }


})


router.delete("/:code", async(req, res, next)=>{
    try {
        const result = await db.query(
            `DELETE FROM companies WHERE code = $1 RETURNING code`, [req.params.code]
        );

        if (result.rows.length === 0){
            throw new ExpressError(`There is no company with code "${req.params.code}"`, 404);
        }

        return res.json({ message: "company deleted"});

    } catch (err) {
        return next(err)
    }
})

module.exports = router;