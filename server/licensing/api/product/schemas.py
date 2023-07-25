import colander


class SchemaProductAdd(colander.Schema):
	name = colander.SchemaNode(colander.String(), required=True)
	description = colander.SchemaNode(colander.String(), required=True)


class SchemaProductById(colander.Schema):
	product_id = colander.SchemaNode(colander.Integer(), required=True)

