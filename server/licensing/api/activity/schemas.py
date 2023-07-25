import colander


class SchemaActivityTracker(colander.Schema):
	hardware_id = colander.SchemaNode(colander.String(), required=True)
	product_guid = colander.SchemaNode(colander.String(), required=True)
	public_key = colander.SchemaNode(colander.String(), required=True)
	os_name = colander.SchemaNode(colander.String(), missing=None)
	ip_address = colander.SchemaNode(colander.String(), missing=None)
	logged_username = colander.SchemaNode(colander.String(), missing=None)
	type = colander.SchemaNode(colander.Integer(), missing=None)
	param_1 = colander.SchemaNode(colander.Integer(), missing=None)
	param_2 = colander.SchemaNode(colander.Integer(), missing=None)
