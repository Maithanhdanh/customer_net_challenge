const mongoose = require("mongoose")
const Schema = mongoose.Schema

/**
 * schema of activity
 * @param {String} event - customer activity
 * @return {Object} structure of search / view item
 */
class ActivitySchema {
	constructor(event = "") {
		this.event = event
	}

	get searchItem() {
		return { query: this.event, date: new Date() }
	}
	get viewItem() {
		return { productId: this.event, date: new Date() }
	}
}

/**
 * activities structure
 * @param {Array} search - customer's search history
 * @param {Array} view - customer's view history
 */
class activities {
	constructor(search = [], view = []) {
		this.search = search
		this.view = view
	}
}

const customerSchema = new Schema(
	{
		uid: { type: String, required: [true, "invalid uid"] },
		activity: { type: Object, default: new activities() },
	},
	{
		timestamps: true,
	}
)

/**
 * Methods
 */
customerSchema.method({
	transform() {
		const transformed = {}
		const fields = ["uid", "activity"]

		fields.forEach((field) => {
			transformed[field] = this[field]
		})

		return transformed
	},
})

/**
 * Statics
 */
customerSchema.statics = {
	/**
	 * Check to create new customer
	 *
	 * @param {String} uid - customer's uid.
	 * @returns {Promise<Customer, error>}
	 */
	async checkToCreateCustomer(uid) {
		try {
			//<!-- Get customer based on email -->
			const customerModel = await this.findOne({ uid }).exec()

			if (customerModel) return null
			const newCustomer = new Customer({ uid })
			const doc = await newCustomer.save()

			return doc
		} catch (error) {
			throw error
		}
	},
	/**
	 * Get customer by uid
	 *
	 * @param {String} uid - customer's uid.
	 * @returns {Promise<Customer, error>}
	 */
	async getCustomerUid(uid) {
		try {
			//<!-- Get customer based on email -->
			const customerModel = await this.findOne({ uid }).exec()

			if (!customerModel) return null
			//transform data

			return customerModel
		} catch (error) {
			throw error
		}
	},

	/**
	 * Get customer and update
	 *
	 * @param {String} uid customer's uid.
	 * @param {String} restParameter searchItem/viewItem - customer's activity.
	 * @returns {Promise<Customer, error>}
	 */
	async getByUidAndUpdate(uid, { ...activity }) {
		try {
			//<!-- Get customer based on email -->
			const customerModel = await this.findOne({ uid })

			if (!customerModel) return null
			//transform data

			if (activity.searchItem) {
				var activityItem = new ActivitySchema(activity.searchItem)
				var item = activityItem.searchItem
				customerModel.activity.search.push(item)
			} else if (activity.viewItem) {
				var activityItem = new ActivitySchema(activity.viewItem)
				var item = activityItem.viewItem
				customerModel.activity.view.push(item)
			}
			const updatedDoc = await this.update(customerModel.id, {
				activity: customerModel.activity,
			})
			
			return updatedDoc
		} catch (error) {
			throw error
		}
	},
	async update(id, { ...data }) {
		try {
			let user

			if (mongoose.Types.ObjectId.isValid(id)) {
				user = await this.findById(id).exec()
			}
			if (user) {
				const keys = Object.keys(data)
				keys.map((key) => {
					user[key] = data[key]
				})
				await user.save()

				return user
			}

			return null
		} catch (error) {
			return error
		}
	},
}

const Customer = mongoose.model("profile", customerSchema, "customer")
module.exports = { Customer, ActivitySchema }
