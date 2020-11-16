const axios = require("axios")
const ENV_VAR = require("./vars")

// <!-- Initial axios request to AUTHENTICATION server -->
const axiosCustomer = axios.create({
	baseURL: ENV_VAR.REGISTRY_URL,
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
	}
})

// <!-- middleware to handle response before return data -->
axiosCustomer.interceptors.response.use(
	(response) => {
		if (response && response.data) {
			return response.data
		}

		return response
	},
	(error) => {
		// Handle errors
		throw error
	}
)
module.exports = axiosCustomer
