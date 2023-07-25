import colander


class SchemaCompanyAdd(colander.Schema):
	name = colander.SchemaNode(colander.String(), required=True)


class SchemaCompanyById(colander.Schema):
	company_id = colander.SchemaNode(colander.Integer(), required=True)
