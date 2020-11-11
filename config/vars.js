const path = require("path")

if (process.env.NODE_ENV !== "production") {
	if (process.env.NODE_ENV === "test") {
		require("dotenv").config({
			path: path.join(__dirname, "../test.env"),
		})
	} else {
		require("dotenv").config({
			path: path.join(__dirname, "../.env"),
		})
	}
}

module.exports = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	MONGODB_URL: process.env.MONGODB_URL,
}
