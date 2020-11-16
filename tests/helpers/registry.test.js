const { register, unregister } = require("../../helpers/registry")
const ENV_VAR = require("../../config/vars")

const ip = "localhost",
	port = ENV_VAR.PORT,
	service = "customer"

beforeAll(async () => {
	await unregister(ip, port, service)
})
afterAll(async () => {
	await unregister(ip, port, service)
})

describe("subscribe service", () => {
	it("success", async () => {
		const res = await register(ip, port, service)

		expect(res).toBe("Register service success")
	})
	it("failed => existed", async () => {
		const res = await register(ip, port, service)

		expect(res).toBe("already exists")
	})
})

describe("unsubscribe service", () => {
	it("failed => invalid input", async () => {
		var ip = "123123", port, service = "customer"

		const res = await unregister(ip, port, service)

		expect(res).toBe('Request failed with status code 400')
	})
	it("success", async () => {
		const res = await unregister(ip, port, service)

		expect(res).toBe("Unregister service success")
	})
})
