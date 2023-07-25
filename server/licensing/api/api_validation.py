import colander
from .exceptions import HTTPException, HTTPBadRequest


def process_schema(schema):
	if schema is None:
		return None
	elif isinstance(schema, colander.Schema):
		return schema
	else:
		raise TypeError('Schema is of invalid type.')


def api_methods_validation(view, info):
	validator_schema = process_schema(info.options.get('validator'))
	if validator_schema is None:
		return view

	def wrapped(context, request):
		if request.body:
			try:
				data = request.json_body
			except:
				try:
					data = json.loads(request.body)
				except:
					data = request.POST
		schema = validator_schema.bind(**data)
		try:
			request.data = schema.deserialize(data)
			request.schema = schema
		except colander.Invalid as e:
			raise HTTPBadRequest({"fields": e.asdict()})
		return view(context, request)

	return wrapped


api_methods_validation.options = ('validator',)


def includeme(config):
	config.add_view_deriver(api_methods_validation)
