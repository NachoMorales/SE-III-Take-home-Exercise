const settings = {
	port: 3100,
	database: {
		uri: undefined,
		host: 'localhost',
		name: 'SE-III',
		itemsPerPage: 20,
		validators: {
			required: () => ({ required: [true, 'Campo obligatorio'] }),
			min: min => ({ min: [min, `El valor no puede ser menor a ${max}`] }),
			max: max => ({ max: [max, `El valor no puede ser mayor a ${max}`] }),
			minLength: min => ({ minLength: [min, 'Minimo de caracteres no alcanzado'] }),
			maxLength: max => ({ maxLength: [max, 'Limite de caracteres superado'] }),
			enum: values => ({ enum: { values, message: 'Valor no permitido' } }),
			email: () => ({ match: [/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i, 'Formato de email incorrecto'] })
		}
	},
};

settings.database.uri = `mongodb://${settings.database.host}/${settings.database.name}`;

module.exports = settings;