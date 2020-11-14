const { Customer } = require("../../models/customer.model")
const server = require("../../index")
const request = require("supertest")
const mongoose = require("mongoose")
const uid = 1
const queryString = "name=asdf&price=0%2C100000&color=red"
const productId = "42109"

beforeAll(async () => {
	jest.useFakeTimers()
	var newCustomer = new Customer({ uid })
	await newCustomer.save()
})

afterAll(async () => {
	await Customer.deleteMany({})
	server.close()
})

describe("Customer", () => {
	describe("global app status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("user routes status", () => {
		it("should return ok", async () => {
			const res = await request(server).get("/customer/status").expect(200)
			expect(res.body).toBe("OK")
		})
	})

	describe("/ => get user", () => {
		it("success", async () => {
			const res = await request(server)
				.get("/customer/")
				.set("Cookie", `uid=${uid}`)
				.expect(200)

			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(2)
			expect(res.body.response.uid).toBe(uid.toString())
		})

		it("failed => missing uid", async () => {
			const res = await request(server).get("/customer/").expect(400)
			expect(res.body.error).toBe(true)
		})
		it("failed => invalid uid", async () => {
			var uid = 2
			const res = await request(server)
				.get(`/customer/`)
				.set("Cookie", `uid=${uid}`)
				.expect(400)

			expect(res.body.error).toBe(true)
			expect(res.body.response).toBe("invalid uid")
		})
		it("failed => invalid uid", async () => {
			const res = await request(server)
				.get("/customer/")
				.set("Cookie", `uid=`)
				.expect(400)
			expect(res.body.error).toBe(true)
		})
	})

	describe("/add_search => add search event", () => {
		it("success", async () => {
			const res = await request(server)
				.get(`/customer/add_search`)
				.set("Cookie", `uid=${uid}`)
				.send({ queryString: queryString })
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(2)
			expect(res.body.response.uid).toBe(uid.toString())
			expect(Object.keys(res.body.response.activity).length).toBe(2)
			expect(res.body.response.activity.search.length).toBe(1)
			expect(res.body.response.activity.search[0].query).toBe(queryString)
		})

		it("success => add another search event", async () => {
			const res = await request(server)
				.get(`/customer/add_search`)
				.set("Cookie", `uid=${uid}`)
				.send({ queryString: queryString })
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(2)
			expect(res.body.response.uid).toBe(uid.toString())
			expect(Object.keys(res.body.response.activity).length).toBe(2)
			expect(res.body.response.activity.search.length).toBe(2)
			expect(res.body.response.activity.search[1].query).toBe(queryString)
		})

		it("failed => missing uid", async () => {
			const res = await request(server)
				.get(`/customer/add_search`)
				.set("Cookie", `uid=`)
				.send({ queryString: queryString })
				.expect(400)

			expect(res.body.error).toBe(true)
		})
		it("failed => invalid uid", async () => {
			var uid = 2
			const res = await request(server)
				.get(`/customer/add_search`)
				.set("Cookie", `uid=${uid}`)
				.send({ queryString: queryString })
				.expect(400)

			expect(res.body.error).toBe(true)
			expect(res.body.response).toBe("invalid uid")
		})
		it("failed => missing queryString", async () => {
			const res = await request(server)
				.get(`/customer/add_search`)
				.set("Cookie", `uid=${uid}`)
				.expect(400)
			expect(res.body.error).toBe(true)
		})
	})

	describe("/add_view => add view event", () => {
		beforeAll(async () => {
			await Customer.deleteMany({})
			var newCustomer = new Customer({ uid })
			await newCustomer.save()
		})
		it("success", async () => {
			const res = await request(server)
				.get(`/customer/add_view`)
				.set("Cookie", `uid=${uid}`)
				.send({ productId: productId })
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(2)
			expect(res.body.response.uid).toBe(uid.toString())
			expect(Object.keys(res.body.response.activity).length).toBe(2)
			expect(res.body.response.activity.view.length).toBe(1)
			expect(res.body.response.activity.view[0].productId).toBe(productId)
		})

		it("success => add another view event", async () => {
			const res = await request(server)
				.get(`/customer/add_view`)
				.set("Cookie", `uid=${uid}`)
				.send({ productId: productId })
				.expect(200)
			expect(res.body.error).toBe(false)
			expect(Object.keys(res.body.response).length).toBe(2)
			expect(res.body.response.uid).toBe(uid.toString())
			expect(Object.keys(res.body.response.activity).length).toBe(2)
			expect(res.body.response.activity.view.length).toBe(2)
			expect(res.body.response.activity.view[1].productId).toBe(productId)
		})

		it("failed => missing uid", async () => {
			const res = await request(server)
				.get(`/customer/add_view`)
				.set("Cookie", `uid=`)
				.send({ productId: productId })
				.expect(400)

			expect(res.body.error).toBe(true)
		})
		it("failed => invalid uid", async () => {
			var uid = 2
			const res = await request(server)
				.get(`/customer/add_view`)
				.set("Cookie", `uid=${uid}`)
				.send({ productId: productId })
				.expect(400)

			expect(res.body.error).toBe(true)
			expect(res.body.response).toBe("invalid uid")
		})
		it("failed => missing queryString", async () => {
			const res = await request(server)
				.get(`/customer/add_view`)
				.set("Cookie", `uid=${uid}`)
				.expect(400)
			expect(res.body.error).toBe(true)
		})
	})
})
