const logger = require("./config/logger")
const server = require("./config/express")
const mongoose = require("./config/mongoose")
const { register, unregister } = require("./helpers/registry.js")
const results = require("./helpers/remoteIp")
const ENV_VAR = require("./config/vars")

mongoose.connect()
mongoose.initialize()

server.listen(ENV_VAR.PORT, () => {
	const ip= results, port= ENV_VAR.PORT, service= "customer"
	register(ip, port, service)
	logger.info(`Server is running on port ${ENV_VAR.PORT} (${ENV_VAR.NODE_ENV})`)
})

server.on('close',() => {
	const ip= results, port= ENV_VAR.PORT, service= "customer"
	unregister(ip, port, service)
	logger.info(`Server is down`)
})
module.exports = server
