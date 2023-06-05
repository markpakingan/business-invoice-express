// this is the invoices.js file inside the routes folder



const express = require("express");
const router = new express.Router();
const db = require("../db")
const ExpressError = require("../expressError")



router.get("/", async (req, res, next)=> {

    try {
        const invoicesQuery = await db.query("SELECT * FROM invoices");
        return res.json({invoices : invoicesQuery.rows})
    } catch (e) {
        return next(e)
    }
    
});




router.get("/:id", async (req, res, next)=>{

    try {

        const invoicesQuery = await db.query("SELECT * FROM invoices WHERE id = $1", [req.params.id]);

        if (invoicesQuery.rows.length === 0){
            let notFoundError = new Error(`There is no invoice with id "${req.params.id}"`);
            notFoundError.status = 404;
            throw notFoundError;
        }
        return res.json({invoices: invoicesQuery.rows[0]})
    } catch(e) {
        return next(e)
    }
});


router.post("/", async(req, res, next)=> {

    try{

        const {comp_code, amt} = req.body;

        const result = await db.query(`INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2) RETURNING comp_code, amt`,
        [comp_code, amt]);

        return res.status(201).json({invoices: result.rows[0]});

    } catch(err){
        return next(err)
    }    
})


// router.patch("/:id", async (req, res, next)=>{
    
//     try{
        
//         if  ("id" in req.body) {
//             throw new ExpressError("Not allowed", 400);
//         }

//         const {amt, paid, paid_date} = req.body;

//         const result = await db.query("UPDATE invoices SET amt = $1, paid = $2, paid_date = CASE WHEN $2 THEN $3 ELSE NULL END WHERE id = $4 RETURNING id, amt, paid, paid_date", 
//         [amt, paid, paid ? new Date() : null, req.params.id]);


//         if (result.rows.length === 0){
//             throw new ExpressError(`There is no invoice with id of "${req.params.id}"`, 404)};
        
//         res.json({ invoices: result.rows[0] });
//     } catch(err){
//         return next(err)
//     }
// })

router.patch("/:id", async (req, res, next) => {
    try {
        if ("id" in req.body) {
            throw new ExpressError("Not allowed", 400);
        }

        const { amt, paid } = req.body;

        let paid_date = null;
        if (paid) {
            // If paying unpaid invoice, set paid_date to today
            paid_date = new Date();
        }

        const result = await db.query(
            "UPDATE invoices SET amt = $1, paid = $2, paid_date = CASE WHEN $2 THEN $3::date ELSE NULL END WHERE id = $4 RETURNING id, amt, paid, paid_date",
            [amt, paid, paid_date, req.params.id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`There is no invoice with id of "${req.params.id}"`, 404);
        }

        res.json({ invoice: result.rows[0] });
    } catch (err) {
        return next(err);
    }
});


router.delete("/:id", async (req, res, next)=>{
    try{
        const result = await db.query(
        "DELETE FROM invoices WHERE id = $1 RETURNING id", [req.params.id])

        if (result.rows.length === 0){
            throw new ExpressError(`There is no invoice with id of "${req.params.id}"`, 404);
        }
        return res.json({message: "Invoice deleted"});

    } catch(err){
        return next(err)
    }
    
})

module.exports = router;