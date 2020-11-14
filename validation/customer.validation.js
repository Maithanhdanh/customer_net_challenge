const { body, cookie } = require("express-validator")

let getUser = () => {
	return [cookie(["uid"]).trim().exists().notEmpty()]
}

let addSearch = () => {
	return [
		cookie(["uid"]).trim().exists().notEmpty(),
		body(["queryString"]).trim().exists().notEmpty(),
	]
}

let addView = () => {
	return [
		cookie(["uid"]).trim().exists().notEmpty(),
		body(["productId"]).trim().exists().notEmpty(),
	]
}

let validate = {
	getUser: getUser,
	addSearch: addSearch,
	addView: addView,
}

module.exports = { validate }
