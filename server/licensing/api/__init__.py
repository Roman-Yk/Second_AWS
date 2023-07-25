from pyramid.config import Configurator
from pyramid.view import exception_view_config

from .exceptions import HTTPException, HTTPBadRequest

import logging
logger = logging.getLogger(__name__)


@exception_view_config(HTTPException, renderer="json")
def exception_handler_view(error, request):
	logger.debug(error)
	request.response.status_code = error.status_code
	return {
		"error": error.message,
		"status": {
			"code": error.status_code,
			"title": error.title,
		}
	}


def includeme(config):
	config.include(".api_validation")
	config.include(".cors")

	config.include(".auth")

	config.include(".user")
	config.include(".license")
	config.include(".user_license")
	config.include(".product")
	config.include(".company")
	config.include(".computer")

	config.include(".activation")
	config.include(".activity")

	config.scan()


def main(global_config, **settings):
	config = Configurator(settings=settings)

	config.include(includeme)

	config.scan()
	return config.make_wsgi_app()
