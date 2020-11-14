const { Customer, ActivitySchema } = require("../../models/customer.model")
const mongoose = require("../../config/mongoose")

const uid = 1

beforeAll(async () => {
	await mongoose.connect()
})

afterAll(async () => {
	await Customer.deleteMany({})
})

describe("activity schema", () => {
	it("activity schema with empty data", () => {
		var activitySchema = new ActivitySchema()

		var searchItem = activitySchema.searchItem
		expect(Object.keys(searchItem).length).toBe(2)
		expect(searchItem).toHaveProperty("query")
		expect(searchItem).toHaveProperty("date")

		var viewItem = activitySchema.viewItem
		expect(Object.keys(viewItem).length).toBe(2)
		expect(viewItem).toHaveProperty("productId")
		expect(viewItem).toHaveProperty("date")
	})

	it("activity schema with data", () => {
		var query = "name=asdf&price=0%2C100000&color=red"
		var activitySchema = new ActivitySchema(query)

		var searchItem = activitySchema.searchItem
		expect(Object.keys(searchItem).length).toBe(2)
		expect(searchItem).toHaveProperty("query")
		expect(searchItem.query).toBe(query)
		expect(searchItem).toHaveProperty("date")

		var view = "42109"
		var activitySchema = new ActivitySchema(view)
		var viewItem = activitySchema.viewItem
		expect(Object.keys(viewItem).length).toBe(2)
		expect(viewItem).toHaveProperty("productId")
		expect(viewItem.productId).toBe(view)
		expect(viewItem).toHaveProperty("date")
	})
})

describe("customer schema and transformed format", () => {
	beforeAll(async function () {
		var newCustomer = new Customer({ uid })
		return (doc = await newCustomer.save())
	})

	it("customer schema", () => {
		expect(doc).toHaveProperty("uid")
		expect(doc.uid).toBe("1")
		expect(doc).toHaveProperty("activity")
	})

	it("transform method", () => {
		var transformedDoc = doc.transform()

		expect(Object.keys(transformedDoc).length).toBe(2)
		expect(transformedDoc).toHaveProperty("uid")
		expect(transformedDoc.uid).toBe("1")
		expect(transformedDoc).toHaveProperty("activity")
	})
})

describe("customer query", () => {
	it("Check to create new customer => create failed", async () => {
		var doc = await Customer.checkToCreateCustomer(uid)
		expect(doc).toBe(null)
	})
	it("Check to create new customer => create success", async () => {
		var uid = 100
		var doc = await Customer.checkToCreateCustomer(uid)
		expect(typeof doc).toBe("object")

		var transformedDoc = doc.transform()
		expect(Object.keys(transformedDoc).length).toBe(2)
		expect(transformedDoc).toHaveProperty("uid")
		expect(transformedDoc.uid).toBe(uid.toString())
		expect(transformedDoc).toHaveProperty("activity")
	})

	it("get customer by uid", async () => {
		var doc = await Customer.getCustomerUid(uid)
		expect(typeof doc).toBe("object")

		var transformedDoc = doc.transform()
		expect(Object.keys(transformedDoc).length).toBe(2)
		expect(transformedDoc).toHaveProperty("uid")
		expect(transformedDoc.uid).toBe("1")
		expect(transformedDoc).toHaveProperty("activity")
	})

	it("get customer by uid => invalid uid ", async () => {
		var uid = 2
		var doc = await Customer.getCustomerUid(uid)
		expect(doc).toBe(null)
	})

	it("get customer by uid and update search event", async () => {
		var searchItem = "name=asdf&price=0%2C100000&color=red"
		var doc = await Customer.getByUidAndUpdate(uid, { searchItem })

		expect(doc.activity.view.length).toBe(0)
		var search = doc.activity.search[0]

		expect(search.query).toBe(searchItem)
		expect(search).toHaveProperty("date")
	})

	it("get customer by uid and update view event", async () => {
		var viewItem = "42109"
		var doc = await Customer.getByUidAndUpdate(uid, { viewItem })

		expect(Object.keys(doc.activity.search).length).toBe(1)
		var view = doc.activity.view[0]

		expect(view.productId).toBe(viewItem)
		expect(view).toHaveProperty("date")
	})

	it("get customer by uid and update => invalid uid", async () => {
		var uid = 2
		var viewItem = "42109"
		var doc = await Customer.getByUidAndUpdate(uid, { viewItem })
		expect(doc).toBe(null)
	})
})

describe("Add multiple events", () => {
	var viewItem = "42109"
	var searchItem = "name=asdf&price=0%2C100000&color=red"

	beforeAll(async () => {
		await Customer.getByUidAndUpdate(uid, { viewItem })
		await Customer.getByUidAndUpdate(uid, { viewItem })
	})

	it("update multi events", async () => {
		var doc = await Customer.getByUidAndUpdate(uid, { searchItem })

		expect(Object.keys(doc.activity.view).length).toBe(3)
		var view = doc.activity.view[0]

		expect(view.productId).toBe(viewItem)
		expect(view).toHaveProperty("date")
	})
})
