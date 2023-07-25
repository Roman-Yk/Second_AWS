from pyramid.view import view_config
from ..exceptions import HTTPConflict, HTTPBadRequest

from sqlalchemy import func, or_, and_, not_
from sqlalchemy.orm import aliased, joinedload
from sqlalchemy.exc import IntegrityError

from licensing.api.auth.security import hash_password

from licensing.database import UserLicense, Computer
from licensing.database.wordpress import WPUser, WPUserMeta
from .schemas import (
	SchemaUserSearchLicenseUsersIgnore,
	SchemaUserUpdatePassword,
	SchemaClientsForLicense,
	SchemaManagerCreate,
	SchemaClientUpdate,
	SchemaClientCreate,
	SchemaUserSearch,
	SchemaUserById,
)

from licensing.api.auth.security import check_password, hash_password


USER_ROLE_ADMIN = 1
USER_ROLE_MANAGER = 2
USER_ROLE_CLIENT = 3


# def create_user(request, UserClass=User, **user_data):
# 	client = UserClass(
# 		registered_by=request.jwt_claims["user_id"],
# 		**user_data,
# 	)
# 	request.dbsession.add(client)
# 	request.dbsession.flush()
# 	return client


@view_config(route_name="user_me", renderer="json", permission="navigate", request_method="POST")
def user_me(request):
	from licensing.api.auth.views import get_user_with_meta
	user, meta = get_user_with_meta(
		request.dbsession,
		request.jwt_claims['user_id'],
		metas=['first_name', 'last_name', 'user_registration_company_name', 'user_registration_phone']
	)
	# user = request.dbsession.query(User)\
	# 	.with_polymorphic([Manager, Client])\
	# 	.filter(id=request.jwt_claims["user_id"])\
	# 	.first()

	return {
		"item": user.as_dict(
			email = user.user_email,
			first_name = meta.get('first_name'),
			last_name = meta.get('last_name'),
			phone = meta.get('user_registration_phone'),
			client_company = meta.get('user_registration_company_name'),
		)
	}


@view_config(route_name="user_search", renderer="json", permission="manager", request_method="POST", validator=SchemaUserSearch())
def user_search(request):
	term = request.data['term']
	term_query = f"%{term}%"
	query = request.dbsession.query(User)\
		.filter(
			or_(
				User.email.ilike(term_query),
				User.first_name.ilike(term_query),
				User.last_name.ilike(term_query),
			)
		)

	users = query.all()

	return {
		"items": [user.as_dict() for user in users],
	}


@view_config(route_name="user_search_ignore_license_users", renderer="json", permission="manager", request_method="POST", validator=SchemaUserSearchLicenseUsersIgnore())
def user_search_ignore_license_users(request):
	term = request.data['term']
	license_id = request.data['license_id']
	term_query = f"%{term}%"

	t = request.dbsession.query(
		UserLicense.user_id,
		func.array_agg(UserLicense.license_id).label("license_ids")
	).group_by(UserLicense.user_id).subquery('t')

	if term:
		term_filter = and_(
			User.role_id == 3,
			or_(
				User.email.ilike(term_query),
				User.first_name.ilike(term_query),
				User.last_name.ilike(term_query),
			),
		)
	else:
		term_filter = User.role_id == 3

	query = request.dbsession.query(User, t.c.license_ids.any(license_id))\
		.join(t, t.c.user_id == User.id, isouter=True)\
		.filter(term_filter)

	users = query.all()

	return {
		"items": [user.as_dict(license_id=license_id) for user, c in users if not c],
	}


# @view_config(route_name="user_update_password", renderer="json", permission="navigate", request_method="POST", validator=SchemaUserUpdatePassword())
# def user_update_password(request):
# 	current_password = request.data['current_password']
# 	new_password = request.data['new_password']
# 	# new_password_repeat = request.data['new_password_repeat']

# 	user = request.dbsession.query(User).get(request.jwt_claims["user_id"])
# 	password_is_correct = check_password(current_password, user.password)
# 	if password_is_correct is True:
# 		user.password = hash_password(new_password)
# 		request.dbsession.flush()
# 	else:
# 		raise HTTPBadRequest({
# 			"fields": {
# 				"current_password": "Current password is incorrect"
# 			}
# 		})

# 	return {
# 		"success": True,
# 		"item": user.as_dict()
# 	}


@view_config(route_name="client_all", renderer="json", permission="manager", request_method="POST")
def client_all(request):
	company_id = request.jwt_claims["company_id"]

	# query = request.dbsession.query(Client)\
	# 	.join(Manager, Manager.id == Client.registered_by)\
	# 	.filter(
	# 		Manager.company_id == company_id
	# 	)

	query = request.dbsession.query(Client)
	clients = query.all()
	return {
		"items": [client.as_dict() for client in clients],
	}


@view_config(route_name="client_all_for_license", renderer="json", permission="manager", request_method="POST", validator=SchemaClientsForLicense())
def client_all_for_license(request):
	from licensing.api.auth.views import get_users_meta
	# company_id = request.jwt_claims["manager_company_id"]
	license_id = request.data["license_id"]

	dbsession = request.dbsession

	query_base = dbsession.query(WPUser)\
		.outerjoin(UserLicense, UserLicense.user_id == WPUser.id)

	query_get_all_filtered_by_license_id = query_base\
		.group_by(WPUser.id)\
		.filter(
			WPUser.id != request.jwt_claims["user_id"]
		)\
		.having(
			func.sum(UserLicense.license_id == license_id) == 0
		)

	query_get_all_where_no_license = query_base\
		.filter(
			UserLicense.id == None,
			WPUser.id != request.jwt_claims["user_id"],
		)

	query = query_get_all_filtered_by_license_id.union(query_get_all_where_no_license)

	clients = query.all()
	client_ids = [c.id for c in clients]
	users_meta = get_users_meta(dbsession, ['first_name', 'last_name', 'user_registration_company_name'], client_ids)

	return {
		"items": [client.as_dict(
			# **users_meta[client.id],
			first_name=users_meta[client.id]['first_name'],
			last_name=users_meta[client.id]['last_name'],
			client_company=users_meta[client.id].get('user_registration_company_name'),
			email = client.user_email,
		) for client in clients],
		"data": users_meta,
		# "data": users_meta,
	}


# @view_config(route_name="client_add", renderer="json", permission="manager", request_method="POST", validator=SchemaClientCreate())
# def client_add(request):
# 	client = None

# 	password = request.data["password"]
# 	del request.data["password"]
# 	del request.data["repeat_password"]

# 	try:
# 		client = create_user(
# 			request,
# 			UserClass=Client,
# 			role_id=USER_ROLE_CLIENT,
# 			password=hash_password(password),
# 			**request.data,
# 		)
# 	except IntegrityError:
# 		raise HTTPConflict({
# 			"fields": {
# 				"email": "Client with this email is already exists."
# 			}
# 		})

# 	return {
# 		"success": True,
# 		"item": client.as_dict(),
# 	}


# @view_config(route_name="client_update", renderer="json", permission="manager", request_method="POST", validator=SchemaClientUpdate())
# def client_update(request):
# 	client = request.dbsession.query(Client).get(request.data["id"])

# 	client.first_name = request.data["first_name"]
# 	client.last_name = request.data["last_name"]
# 	client.client_company = request.data["client_company"]
# 	client.phone = request.data["phone"]
# 	client.email = request.data["email"]

# 	if request.data["new_password"] is not None:
# 		client.password = hash_password(request.data["new_password"])

# 	request.dbsession.flush()

# 	return {
# 		"success": True,
# 		"item": client,
# 	}


# @view_config(route_name="client_delete", renderer="json", permission="manager", request_method="POST", validator=SchemaUserById())
# def client_delete(request):
# 	client_id = request.data['user_id']

# 	query = request.dbsession.query(Client)
# 	client = query.get(client_id)

# 	if client.registered_by != request.jwt_claims["user_id"] or client.role_id != USER_ROLE_CLIENT:
# 		return {
# 			"success": False
# 		}

# 	request.dbsession.delete(client)
# 	request.dbsession.flush()

# 	return {
# 		"success": True,
# 	}


# @view_config(route_name="manager_all", renderer="json", permission="admin", request_method="POST")
# def manager_all(request):
# 	users_count_sub = request.dbsession.query(
# 		Client.registered_by,
# 		func.count(Client.id).label("clients_count")
# 	).group_by(Client.registered_by).subquery("t")

# 	query = request.dbsession.query(
# 		Manager,
# 		users_count_sub.c.clients_count,
# 	)\
# 		.options(joinedload("company"))\
# 		.filter(
# 			Manager.role_id == 2,
# 			Manager.id != request.jwt_claims["user_id"])\
# 		.outerjoin(users_count_sub, users_count_sub.c.registered_by == Manager.id)\
# 		.order_by(Manager.company_id.asc(), Manager.time_registered.desc())\

# 	managers = query.all()

# 	return {
# 		"items": [manager.as_dict(
# 			usersCount=count or 0,
# 			company=manager.company.name,
# 		) for manager, count in managers],
# 	}


# @view_config(route_name="manager_add", renderer="json", permission="admin", request_method="POST", validator=SchemaManagerCreate())
# def manager_add(request):
# 	manager = None

# 	password = request.data["password"]
# 	del request.data["password"]
# 	del request.data["repeat_password"]

# 	try:
# 		manager = create_user(
# 			request,
# 			UserClass=Manager,
# 			password=hash_password(password),
# 			role_id=USER_ROLE_MANAGER,
# 			**request.data
# 		)
# 	except IntegrityError:
# 		raise HTTPConflict({
# 			"fields": {
# 				"email": "User with email already exists."
# 			}
# 		})

# 	return {
# 		"success": True,
# 		"item": manager.as_dict(
# 			usersCount=0,
# 			company=manager.company.name,
# 		),
# 	}


# @view_config(route_name="manager_delete", renderer="json", permission="admin", request_method="POST", validator=SchemaUserById())
# def manager_delete(request):
# 	manager_id = request.data['user_id']

# 	query = request.dbsession.query(User)
# 	manager = query.get(manager_id)
# 	if manager.role_id == USER_ROLE_ADMIN:
# 		return {
# 			"success": False
# 		}
# 	request.dbsession.delete(manager)
# 	request.dbsession.flush()

# 	return {
# 		"success": True,
# 	}
