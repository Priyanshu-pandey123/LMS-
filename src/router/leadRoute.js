const express = require("express");

const leadRoutes = express.Router();
const { createOrUpdateLead, getLead } = require("../controller/leadController");
const authToken = require("../middleware/authToke");

// leadRoutes.use("/", (req, res) => {
//   return res.send("welcome to lead gen");
// });

leadRoutes.post("/create", createOrUpdateLead);
// leadRoutes.get("/get", authToken, getLead);

module.exports = leadRoutes;
