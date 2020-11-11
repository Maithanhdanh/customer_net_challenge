const responseReturn = require("../response/responseReturn")
const { Customer } = require("../models/customer.model")
const { validationResult } = require("express-validator")

exports.getUser = async (req, res, next) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 400, errors.array())
		return
	}

	try {
		const { uid } = req.cookies
		const customer = await Customer.getCustomerUid(uid)
		if(!customer) return resReturn.failure(req, res, 400, "invalid uid")

		const transformedDoc = customer.transform()

		resReturn.success(req, res, 200, transformedDoc)
	} catch (error) {
		resReturn.failure(req, res, 500, error.message)
	}
}
exports.addSearch = async (req, res, next) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 400, errors.array())
		return
	}

	try {
		const { uid } = req.cookies
		const { queryString } = req.body

		const customer = await Customer.getByUidAndUpdate(uid,{
			searchItem: queryString,
		})
		if(!customer) return resReturn.failure(req, res, 400, "invalid uid")
		const transformedDoc = customer.transform()

		resReturn.success(req, res, 200, transformedDoc)
	} catch (error) {
		resReturn.failure(req, res, 500, error.message)
	}
}
exports.addView = async (req, res, next) => {
	const errors = validationResult(req)
	let resReturn = new responseReturn()
	if (!errors.isEmpty()) {
		resReturn.failure(req, res, 400, errors.array())
		return
	}

	try {
		const { uid } = req.cookies
		const { productId } = req.body
		const customer = await Customer.getByUidAndUpdate(uid, { viewItem: productId })
		if(!customer) return resReturn.failure(req, res, 400, "invalid uid")
		const transformedDoc = customer.transform()

		resReturn.success(req, res, 200, transformedDoc)
	} catch (error) {
		resReturn.failure(req, res, 500, error.message)
	}
}
