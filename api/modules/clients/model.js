'use strict';

module.exports = (module) => {

	module.schema = new global.database.mongodb.mongoose.Schema({

		address: { type: String },
		city: { type: String },
		headcount: { type: Number },
		name: {
			type: String,
			index: true,
			...module.settings.database.validators.required()
		},
		state: { type: String, index: true },
		type: {
			type: String,
			...module.settings.database.validators.enum(['public', 'private']),
			...module.settings.database.validators.required()
		},
		zip: { type: Number },

	}, { timestamps: true });
};
