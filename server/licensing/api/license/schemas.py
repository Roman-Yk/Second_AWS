import colander


LICENSE_TYPE_PERMANENT = 1
LICENSE_TYPE_SUBSCRIPTION = 2


# @colander.deferred
# def deferred_trial_days(node, kw):
# 	if int(kw.get("type_id")) == LICENSE_TYPE_TRIAL:
# 		return colander.SchemaNode(colander.Integer(), required=True)


class SchemaLicensesAdd(colander.Schema):
	name = colander.SchemaNode(colander.String(), required=True)
	type_id = colander.SchemaNode(colander.Integer(), required=True)
	product_id = colander.SchemaNode(colander.Integer(), required=True)
	# trial_days = deferred_trial_days


class SchemaLicensesGetByProduct(colander.Schema):
	product_id = colander.SchemaNode(colander.Integer(), required=True)
