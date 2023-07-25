import colander


user_id = colander.SchemaNode(colander.Integer(), required=True)
license_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaUserLicenseAdd(colander.Schema):
	user_id = colander.SchemaNode(colander.Integer(), required=True)
	license_id = colander.SchemaNode(colander.Integer(), required=True)
	count = colander.SchemaNode(colander.Integer(), required=False, default=2)


class SchemaUserLicenseUpdate(colander.Schema):
	id = colander.SchemaNode(colander.Integer(), required=True)
	count = colander.SchemaNode(colander.Integer(), required=True)
	# expiration_date = colander.SchemaNode(colander.Date(format="%Y-%m-%d"), missing=colander.drop)
	expiration_date = colander.SchemaNode(colander.Date(format="%Y-%m-%d"), missing=None)

	@colander.instantiate(missing=colander.drop)
	class features(colander.SequenceSchema):
		item = colander.SchemaNode(colander.String())


class SchemaUserLicenseById(colander.Schema):
	user_license_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaUserLicensesByUserId(colander.Schema):
	user_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaUserLicensesByLicenseId(colander.Schema):
	license_id = colander.SchemaNode(colander.Integer(), required=True)
