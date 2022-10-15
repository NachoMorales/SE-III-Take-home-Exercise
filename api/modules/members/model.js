'use strict';

module.exports = (module) => {

	module.schema = new global.database.mongodb.mongoose.Schema({

		email: { type: String, ...module.settings.database.validators.email() },
		client: {
			type: global.database.mongodb.mongoose.Schema.Types.ObjectId, ref: 'clients',
			...module.settings.database.validators.required()
		},
		name: { type: String, ...module.settings.database.validators.required() },
		notes: [
			{
				date: { type: Date, default: Date.now },
				detail: {
					type: String,
					...module.settings.database.validators.maxLength(1000),
					...module.settings.database.validators.required()
				},
			}
		],
		phoneNumber: { type: String }

	}, { timestamps: true });
};
