from pyramid.config import Configurator
from datetime import datetime

server_start_time = int(datetime.utcnow().timestamp())


def main(global_config, **settings):
	config = Configurator(settings=settings)

	config.include("pyramid_jinja2")
	config.commit()

	config.add_static_view("static", "static", cache_max_age=3600)

	# Separated
	config.include("licensing.database")
	config.include("licensing.api", route_prefix="/api")

	# Routes
	config.add_route("home", "/")
	config.add_route("settings", "/settings")
	config.add_route("settings_personal_info", "/settings/personal-info")

	config.add_request_method(
		lambda r: server_start_time,
		'server_start_time',
		reify=True
	)

	config.scan()
	return config.make_wsgi_app()
