# from pyramid.response import Response
from pyramid.view import view_config, notfound_view_config
# from pyramid.view import view_config
# from pyramid.security import Authenticated

# from sqlalchemy.exc import DBAPIError


@notfound_view_config(renderer='./templates/404.jinja2')
def notfound_view(request):
	request.response.status = 404
	return {}


@view_config(route_name="home", renderer="./templates/home/index.jinja2", permission='navigate')
def home(request):
	role_name = request.jwt_claims.get('user_role')

	if role_name in ["admin", "manager", "client"]:
		request.override_renderer = f"./templates/home/roles/{role_name}.jinja2"

	return {}


@view_config(route_name="settings", renderer="./templates/settings/index.jinja2", permission='navigate')
def settings(request):
	return {
		"personal_info": {
			"id": request.jwt_claims["user_id"],
			"email": request.jwt_claims["user_email"],
			"first_name": request.jwt_claims["user_first_name"],
			"last_name": request.jwt_claims["user_last_name"],

			"client_company": request.jwt_claims["client_company"],
			"manager_company_id": request.jwt_claims["manager_company_id"],

			# "user_id": 2,
			# "user_email": "admin@elsman.com",
			# "user_first_name": "Admin",
			# "user_last_name": "Manager",
			# "user_role": "manager",
			# "manager_company_id": 1,
			# "client_company": null,
			# "last_login_updated": 1
		}
	}


@view_config(route_name="settings_personal_info", renderer="json", permission='navigate')
def settings_personal_info(request):
	return {
		"id": request.jwt_claims["user_id"],
		"email": request.jwt_claims["user_email"],
		"phone": request.jwt_claims["user_phone"],
		"first_name": request.jwt_claims["user_first_name"],
		"last_name": request.jwt_claims["user_last_name"],

		"client_company": request.jwt_claims["client_company"],
		"manager_company_id": request.jwt_claims["manager_company_id"],

		# "user_id": 2,
		# "user_email": "admin@elsman.com",
		# "user_first_name": "Admin",
		# "user_last_name": "Manager",
		# "user_role": "manager",
		# "manager_company_id": 1,
		# "client_company": null,
		# "last_login_updated": 1
	}
