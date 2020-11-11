const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const router = require("../routes/index")
const cookieParser = require("cookie-parser")
const ENV_VAR = require("./vars")

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

if (ENV_VAR.NODE_ENV !== "test") {
	if (ENV_VAR.NODE_ENV === "production") {
		app.use(morgan("combined"))
	} else {
		app.use(morgan("dev"))
	}
}

app.use("/", router)

const server = require("http").Server(app)

module.exports = server
