const express = require("express")
const router = express.Router()

const controller = require("../controllers/customer.controller")
const { validate } = require("../validation/customer.validation")


router.route("/").get(validate.getUser(),controller.getUser)

router.route("/add_search").get(validate.addSearch(),controller.addSearch)
router.route("/add_view").get(validate.addView(),controller.addView)

router.route("/status").get((req, res) => res.json("OK"))
module.exports = router