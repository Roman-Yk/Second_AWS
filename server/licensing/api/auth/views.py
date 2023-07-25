from pyramid.security import remember, forget
from pyramid.httpexceptions import HTTPFound, HTTPNotFound
from pyramid.view import forbidden_view_config, view_config
from pyramid.response import Response

import transaction
import json
from sqlalchemy import func
from sqlalchemy.orm import with_polymorphic, selectin_polymorphic, joinedload, aliased
from licensing.database import UserRole
from licensing.database.wordpress import WPUser, WPUserMeta
from licensing.database.meta import wp_prefix

from datetime import datetime
import colander
import deform

from .security import check_password
from .schemas import SchemaLogin, BackendAuthSchema
from ..exceptions import HTTPException, HTTPBadRequest

USER_ROLES = {
	's:13:"administrator";b:1': 2,
	's:10:"subscriber";b:1': 3,
	's:8:"customer";b:1': 3,
}


def get_user_role_id(role):
	for user_role in USER_ROLES:
		role_id = USER_ROLES[user_role] if user_role in role else None
		if role_id:
			return role_id
	return None
	# return USER_ROLES.get(role, None)


def generate_token(request, company_id, user, meta):
	user_role_id = get_user_role_id(meta.get(wp_prefix("capabilities")))
	if user_role_id is None:
		meta_val = meta.get(wp_prefix("capabilities"))
		raise HTTPBadRequest(f"User role is invalid '{meta_val}'")
	role = request.dbsession.query(UserRole).get(user_role_id)
	data = dict(
		user_id = user.id,
		user_role = role.name,
		company_id = company_id,
	)

	# if manager is not None:
	# 	data['manager_company_id'] = manager.company_id
	# if client is not None:
	# 	data['client_company'] = client.client_company

	if 'user_registration_company_name' in meta:
		data['client_company'] = meta['user_registration_company_name']

	return request.create_jwt_token(
		user.id,
		**data,
		# user_role = user_role,
		# user_role_name = meta.meta_value,
		# user_email = user.email,
		# user_first_name = user.first_name,
		# user_last_name = user.last_name,
		# manager_company_id = getattr(manager, "company_id", None),
		# client_company = getattr(user, "client_company", None),
	)


# def signin(request, email, password):
# 	user = request.dbsession.query(User)\
# 		.with_polymorphic([Manager, Client])\
# 		.filter_by(email=email)\
# 		.first()

# 	try:
# 		if not user:
# 			exc = colander.Invalid(request.schema)
# 			exc["email"] = "Incorrect email"
# 			raise exc
# 		if not check_password(password, user.password):
# 			exc = colander.Invalid(request.schema)
# 			exc["password"] = "Incorrect password"
# 			raise exc
# 	except colander.Invalid as e:
# 		raise HTTPBadRequest({"fields": e.asdict()})

# 	return user


# @view_config(route_name="login_jwt", request_method="POST", renderer="json", validator=SchemaLogin())
# def login_jwt(request):
# 	user = signin(request, request.data["email"], request.data["password"])

# 	return {
# 		"token": generate_token(request, user)
# 	}


# @view_config(route_name="login_session", request_method="POST", renderer="json", validator=SchemaLogin())
# def login_session(request):
# 	user = signin(request, request.data["email"], request.data["password"])

# 	return {
# 		"token": generate_token(request, user)
# 	}


# select um.user_id, JSON_OBJECTAGG(um.meta_key, um.meta_value)
# from wp_usermeta um
# where um.meta_key = 'first_name'
# group by um.user_id
# having um.user_id in (1,2,3)

def get_users_meta_query(dbsession, metas = None):
	query = dbsession.query(
			WPUserMeta.user_id,
			func.json_objectagg(WPUserMeta.meta_key, WPUserMeta.meta_value).label('data')
		)\
		.group_by(WPUserMeta.user_id)

	if metas:
		query = query.filter(WPUserMeta.meta_key.in_(metas))
		# .filter(WPUserMeta.meta_key.in_(metas))\
		# .having(WPUserMeta.user_id.in_(ids))
	return query


def get_users_meta(dbsession, metas, ids):
	query = get_users_meta_query(dbsession, metas=metas)\
		.having(WPUserMeta.user_id.in_(ids))
	meta_raw = query.all()
	meta = {user_id: json.loads(data) for user_id, data in meta_raw}
	return meta


def get_user_with_meta(dbsession, user_id, metas = None):
	meta_query = get_users_meta_query(dbsession, metas).subquery('meta')

	user_with_meta = dbsession.query(WPUser, meta_query.c.data)\
		.filter(WPUser.id == user_id)\
		.join(meta_query, meta_query.c.user_id == WPUser.id)\
		.first()
	if user_with_meta:
		user, metas = user_with_meta
		meta = json.loads(metas)
		return user, meta
	else:
		return None


@view_config(route_name="auth_backend", request_method="POST", validator=BackendAuthSchema())
def auth_backend(request):
	if request.data.get('secret') != "e428923d-e17e-43c7-821c-23dda1c04031":
		return Response(body='', status=403)

	user_with_meta = get_user_with_meta(request.dbsession, request.data.get('id'), [
		wp_prefix("capabilities"),
		"user_registration_company_name"
	])

	print("USER META >>>>", user_with_meta)
	if user_with_meta:
		user, meta = user_with_meta
		print("USER AND META >>>>", user, meta)
		try:
			token = generate_token(request, request.data.get('company_id'), user, meta)
			print("TOKEN", token)
		except Exception as e:
			# raise e
			print(e)
			token = None
			return Response(body='', status=403)

		return Response(
			body=token
		)

	return Response(body='', status=403)


@view_config(route_name="status", renderer="json")
def status(request):
	return request.jwt_claims
