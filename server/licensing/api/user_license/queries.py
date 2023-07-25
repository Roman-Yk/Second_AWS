from sqlalchemy.orm import joinedload, load_only
from sqlalchemy import func

from licensing.database import Computer, UserLicense, License, Product, Company
from licensing.database.wordpress import WPUser


def query_get_licenses_by_user(session, user_id):
	return session.query(UserLicense)\
		.filter(UserLicense.user_id == user_id)\
		.options(
			joinedload(UserLicense.license).joinedload(License.type)
		)


def query_user_licenses_by_license_id(session, license_id):
	query = session.query(
		UserLicense,
		WPUser,
		Computer,
		License,
		Product,
		Company,
	)\
		.filter(UserLicense.license_id == license_id)\
		.outerjoin(WPUser, UserLicense.user_id == WPUser.id)\
		.outerjoin(Computer, Computer.user_license_id == UserLicense.id)\
		.order_by(UserLicense.id.desc())
		# .outerjoin(Computer, UserLicense.id == Computer.user_license_id)\

	return query


def query_user_license_by_id(session, user_license_id):
	sub = session.query(
		Computer.user_license_id,
		func.count(Computer.id).label('count')
	)\
		.filter(Computer.is_active == True, Computer.is_enabled == True)\
		.group_by(Computer.user_license_id)\
		.subquery()

	query = session.query(UserLicense, sub.c.count)\
		.filter(UserLicense.id == user_license_id)\
		.join(sub, UserLicense.id == sub.c.user_license_id, isouter=True)\
		.order_by(UserLicense.id.desc())\
		.options(
			joinedload("license").joinedload("product").joinedload("company"),
			joinedload("user")
		)

	return query


def query_user_license(session):
	sub = session.query(
		Computer.user_license_id,
		func.count(Computer.id).label('count')
	)\
		.filter(Computer.is_active == True, Computer.is_enabled == True)\
		.group_by(Computer.user_license_id)\
		.subquery()

	query = session.query(UserLicense, sub.c.count)\
		.join(sub, UserLicense.id == sub.c.user_license_id, isouter=True)\
		.order_by(UserLicense.id.desc())\
		.options(
			joinedload("license").joinedload("product").joinedload("company"),
			joinedload("user")
		)

	return query
