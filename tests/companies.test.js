process.env.Node_env = "test";

const request = require("supertest");

const app = require("../app");
const db = require ("../db");
const ExpressError = require("../expressError");

let testCompanies; 

beforeEach(async () => {

  // Delete any existing records from the companies table
  await db.query("DELETE FROM companies");


  const result = await db.query(`INSERT INTO companies (code, name, description) VALUES 
  ('apple', 'Apple Computer', 'Maker of OSX.') RETURNING code, name, description`);

  testCompanies = result.rows[0]
})

afterEach(async ()=> {
  await db.query(`DELETE FROM companies`);
})

afterAll(async()=>{
  await db.end();
});

  
  describe("GET /companies", () => {
    test("Gets list of all companies", async () => {
      const response = await request(app).get("/companies");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({companies: [testCompanies]});
    });
  });
  

  // describe("GET /companies/:code", ()=> {
  //   test("returns a single company", async()=>{
  //     const response = await request(app).get(`/companies/${testCompanies.code}`);
  //     expect(response.statusCode).toEqual(200);
  //     expect(response.body).toEqual({companies: testCompanies})
  //   })
  // })

  describe("POST /companies", () =>{
    test("post a single company", async ()=> {
      const response = await request(app).post("/companies").send({code: "Samsung", name: "Galaxy", 
      description : "designed for humans"});
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        companies: {code: "Samsung", name: "Galaxy", description: "designed for humans"}
      })
    })
  })


  describe("PATCH /companies/:code", ()=> {
    test("updates a single company", async () => {
      const response = await request(app)
        .patch(`/companies/${testCompanies.code}`)
        .send({name: "Iphone Computer", description: "Maker of OSX."});
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
      companies: {code: "apple", name: "Iphone Computer", description : "Maker of OSX."}
      });
    });

    test("Responds with 404 if can't find cat", async function() {
      const response = await request(app).get(`/companies/fakecode`);
      expect(response.statusCode).toEqual(404);
    });
  });

  describe("DELETE /companies/:code", ()=>{
    test("deletes a single company", async()=> {
      const response = await request(app).delete(`/companies/${testCompanies.code}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: "company deleted"})
    });
  });