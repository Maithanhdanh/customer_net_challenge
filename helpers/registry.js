const axiosRegistry = require("../config/axiosRegistry")
const ROUTE_MAP = require("../config/urlBase")

const logger = require("../config/logger")

exports.register = async (ip, port, service) => {
	try {
		const response = await axiosRegistry({
			method: ROUTE_MAP.REGISTRY.REGISTER.METHOD,
			url: ROUTE_MAP.REGISTRY.REGISTER.PATH,
			data: { ip, port, service },
		})
		if (response.response === 'already exists') throw new Error(response.response)

		logger.info("Register service success")
		return "Register service success"
	} catch (errors) {
		logger.info(`Register service failed => duel to ${errors.message}`)
		return errors.message
	}
}

exports.unregister = async (ip, port, service) => {
	try {
		const response = await axiosRegistry({
			method: ROUTE_MAP.REGISTRY.UNREGISTER.METHOD,
			url: ROUTE_MAP.REGISTRY.UNREGISTER.PATH,
			data: { ip, port, service },
		})
		if (response.error) throw new Error(response.response)

		logger.info("Unregister service success")
		return "Unregister service success"
	} catch (errors) {
		logger.info(`Unregister service failed => duel to ${errors.message}`)
		return errors.message
	}
}
