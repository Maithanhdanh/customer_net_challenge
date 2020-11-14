const express = require("express")
const authRoutes = require("./customer.route")
const router = express.Router()

router.get("/status", (req, res) => res.json("OK"))

router.use("/customer", authRoutes)
module.exports = router
