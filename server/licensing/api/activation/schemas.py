import colander


class SchemaActivation(colander.Schema):
	hardware_id = colander.SchemaNode(colander.String(), required=True)
	product_guid = colander.SchemaNode(colander.String(), required=True)
	public_key = colander.SchemaNode(colander.String(), required=True)


class SchemaActivationWithLog(SchemaActivation):
	os_name = colander.SchemaNode(colander.String(), missing="-")
	ip_address = colander.SchemaNode(colander.String(), missing="0.0.0.0")
	logged_username = colander.SchemaNode(colander.String(), missing="-")
