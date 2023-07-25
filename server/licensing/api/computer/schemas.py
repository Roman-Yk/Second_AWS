import colander


class SchemaComputersGetByUserLicense(colander.Schema):
	user_license_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaComputersUpdateDescription(colander.Schema):
	id = colander.SchemaNode(colander.Integer(), required=True)
	h_description = colander.SchemaNode(colander.String(), validator=colander.Length(max=1024), missing="")


class SchemaComputersById(colander.Schema):
	computer_id = colander.SchemaNode(colander.Integer(), required=True)
