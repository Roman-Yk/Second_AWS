from pyramid.events import NewRequest
from pyramid.security import NO_PERMISSION_REQUIRED


def includeme(config):
	config.add_subscriber(add_cors_headers_response_callback, NewRequest)

	config.add_route_predicate('cors_preflight', CorsPreflightPredicate)

	config.add_route(
		'cors-options-preflight', '/{catch_all:.*}',
		cors_preflight=True,
	)
	config.add_view(
		cors_options_view,
		route_name='cors-options-preflight',
		permission=NO_PERMISSION_REQUIRED,
	)


def add_cors_headers_response_callback(event):
	def cors_headers(request, response):
		response.headers.update({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
			'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Max-Age': '1728000',
		})
	event.request.add_response_callback(cors_headers)


def cors_options_view(context, request):
	response = request.response
	if 'Access-Control-Request-Headers' in request.headers:
		response.headers.update({
			'Access-Control-Allow-Methods': 'OPTIONS,HEAD,GET,POST,PUT,DELETE',
		})
	response.headers.update({
		'Access-Control-Allow-Headers': 'Content-Type,Accept,Accept-Language,Authorization,X-Request-ID',
	})
	return response


class CorsPreflightPredicate(object):
	def __init__(self, val, config):
		self.val = val

	def text(self):
		return 'cors_preflight = %s' % bool(self.val)

	phash = text

	def __call__(self, context, request):
		if not self.val:
			return False
		return (
			request.method == 'OPTIONS' and
			'Origin' in request.headers and
			'Access-Control-Request-Method' in request.headers
		)