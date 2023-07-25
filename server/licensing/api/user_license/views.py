from pyramid.view import view_config

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from licensing.database import UserLicense, Computer, License, Product, Company
from licensing.database.wordpress import WPUser, WPUserMeta
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from ..exceptions import HTTPConflict, HTTPBadRequest
from ..utils import normalize

from .schemas import (
	SchemaUserLicenseAdd,
	SchemaUserLicenseUpdate,
	SchemaUserLicenseById,
	SchemaUserLicensesByUserId,
	SchemaUserLicensesByLicenseId
)

from .queries import (
	query_get_licenses_by_user,
	query_user_license_by_id,
	query_user_license,
	query_user_licenses_by_license_id
)

from licensing.api.auth.views import get_users_meta, get_user_with_meta

import json
import datetime as dt
from collections import namedtuple

WPUserMetaData = namedtuple("PWUserMeta", ["id", "keys", "values"])


@view_config(route_name="user_license_all_by_license", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicensesByLicenseId())
def user_license_all_by_license(request):
	license_id = request.data["license_id"]

	metas = request.dbsession.query(
		WPUserMeta.user_id.label("id"),
		func.json_arrayagg(WPUserMeta.meta_key).label("key"),
		func.json_arrayagg(WPUserMeta.meta_value).label("value")
	)\
		.group_by(WPUserMeta.user_id)\
		.subquery('m')

	query = request.dbsession.query(
		UserLicense,
		License,
		WPUser,
		Computer,
		metas,
	)\
		.outerjoin(UserLicense.license)\
		.outerjoin(WPUser, WPUser.id == UserLicense.user_id)\
		.outerjoin(UserLicense.hardwares)\
		.outerjoin(metas, metas.c.id == WPUser.id)\
		.filter(License.id == license_id)

	items_ = query.all()

	items = []
	for i in items_:
		items.append(list(i[:4]) + [WPUserMetaData(i[4], i[5], i[6])])

	if items:
		user_licenses, licenses, clients, computers, client_metas = normalize(items)
		user_licenses.sort(key=lambda x: [x.is_enabled, x.id], reverse=True)
		computers.sort(key=lambda x: [x.is_active, x.id], reverse=True)
	else:
		user_licenses, licenses, clients, computers, client_metas = [], [], [], [], []

	cm = get_users_meta(
		request.dbsession,
		['first_name', 'last_name', 'user_registration_company_name', 'user_registration_phone'],
		[c.id for c in clients]
	)

	return {
		"user_licenses": user_licenses,
		"clients": [dict(
			id = c.id,
			email = c.user_email,
			first_name = cm[c.id].get("first_name"),
			last_name = cm[c.id].get("last_name"),
			client_company = cm[c.id].get("user_registration_company_name"),
			phone = cm[c.id].get("user_registration_phone"),
		) for c in clients],
		"computers": computers,
		"licenses": licenses,
	}


@view_config(route_name="user_license_all_by_user", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicensesByUserId())
def user_license_all_by_user(request):
	user_id = request.data.get("user_id")
	items = query_get_licenses_by_user(request.dbsession, user_id).all()
	result = [user_license.as_dict(
		license=user_license.license.as_dict(
			type=user_license.license.type.as_dict()
		),
	) for user_license in items]

	return {
		"items": result,
	}


@view_config(route_name="user_license_all_my", renderer="json", permission="client", request_method="POST")
def user_license_all_my(request):
	user_id = request.jwt_claims["user_id"]

	t = request.dbsession.query(
		Computer.user_license_id,
		func.count(Computer.id).label('hardwares_count')
	)\
		.filter_by(is_active=True)\
		.group_by(Computer.user_license_id)\
		.subquery("t")

	items = request.dbsession.query(UserLicense, t.c.hardwares_count)\
		.outerjoin(t, t.c.user_license_id == UserLicense.id)\
		.filter(UserLicense.user_id == user_id)\
		.options(
			joinedload("license").joinedload("product").joinedload("company"),
			joinedload("license").joinedload("type")
		)\
		.all()

	result = [user_license.as_dict(
		license=user_license.license.as_dict(
			type=user_license.license.type.as_dict(),
			product=user_license.license.product.as_dict(),
		),
		current_count=hardwares_count or 0,
	) for user_license, hardwares_count in items]

	return {
		"items": result,
	}


@view_config(route_name="user_license_add", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicenseAdd())
def user_license_add(request):
	license = request.dbsession.query(License).get(request.data["license_id"])
	if license.trial_days:
		expiration_date = dt.datetime.now().date() + dt.timedelta(days=license.trial_days)
	else:
		expiration_date = None
	user_license = UserLicense(
		user_id=request.data["user_id"],
		license_id=request.data["license_id"],
		count=request.data["count"],
		features=license.initial_features,
		expiration_date=expiration_date,
	)

	request.dbsession.add(user_license)
	try:
		request.dbsession.flush()
	except IntegrityError as e:
		print(" >>> >> > > >> > > ERRRORRORORORO >>>>>", e)
		raise HTTPConflict({
			"message": "This license is currently assigned to the user!",
			"fields": {
				"user_id": "Please select another user"
			}
		})

	user, meta = get_user_with_meta(request.dbsession, user_license.user_id, metas = [
		'first_name',
		'last_name',
		'user_registration_phone',
		'user_registration_company_name',
	])

	return {
		"success": True,
		"user_license": user_license,
		"license": user_license.license,
		"user": dict(
			**user.as_dict(),
			email = user.user_email,
			first_name = meta.get('first_name'),
			last_name = meta.get('last_name'),
			phone = meta.get('user_registration_phone'),
			client_company = meta.get('user_registration_company_name'),
		)
	}


@view_config(route_name="user_license_update", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicenseUpdate())
def user_license_update(request):
	user_license = request.dbsession.query(UserLicense).get(request.data["id"])
	user_license.count = request.data["count"]
	if "features" in request.data:
		user_license.features = json.dumps(request.data["features"])

	if "expiration_date" in request.data:
		user_license.expiration_date = request.data["expiration_date"]

	request.dbsession.flush()

	return {
		"success": True,
		"item": user_license,
	}


@view_config(route_name="user_license_delete", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicenseById())
def user_license_delete(request):
	user_license_id = request.data.get('user_license_id')

	query = request.dbsession.query(UserLicense)
	user_license = query.get(user_license_id)
	request.dbsession.delete(user_license)
	request.dbsession.flush()

	return {
		"success": True,
	}


@view_config(route_name="user_license_disable", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicenseById())
def user_license_disable(request):
	user_license_id = request.data.get('user_license_id')

	user_license = request.dbsession.query(UserLicense).get(user_license_id)
	if user_license is None:
		raise HTTPBadRequest({
			"errorMessage": f"User license for id '{user_license_id}' is not found."
		})

	user_license.is_enabled = False
	request.dbsession.flush()

	return {
		"success": True,
		"item": user_license.as_dict()
	}


@view_config(route_name="user_license_enable", renderer="json", permission="manager", request_method="POST", validator=SchemaUserLicenseById())
def user_license_enable(request):
	user_license_id = request.data.get('user_license_id')

	user_license = request.dbsession.query(UserLicense).get(user_license_id)
	if user_license is None:
		raise HTTPBadRequest({
			"errorMessage": f"User license for id '{user_license_id}' is not found."
		})

	user_license.is_enabled = True
	request.dbsession.flush()

	return {
		"success": True,
		"item": user_license.as_dict()
	}
