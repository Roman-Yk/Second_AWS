from pyramid.view import view_config

from sqlalchemy import func
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError

from ..exceptions import HTTPConflict

from licensing.database import License, Product, UserLicense, LicenseType, Company

from .schemas import (
	SchemaLicensesAdd,
	SchemaLicensesGetByProduct
)


@view_config(route_name="license_type_all", renderer="json", permission="manager", request_method="POST")
def license_type_all(request):
	query = request.dbsession.query(LicenseType).order_by(LicenseType.id.asc())
	license_types = query.all()
	items = [license_type.as_dict() for license_type in license_types]
	return {
		"items": items
	}


@view_config(route_name="license_all", renderer="json", permission="manager", request_method="POST", validator=SchemaLicensesGetByProduct())
def license_all(request):
	product_id = request.data["product_id"]

	licenses = request.dbsession.query(
		License,
		func.count(UserLicense.id),
	)\
		.join(Product)\
		.outerjoin(License.users)\
		.filter(Product.id == product_id)\
		.group_by(License)\
		.order_by(License.trial_days.desc(), License.id.asc())\
		.all()

	result = [
		license.as_dict(usersCount=user_licenses_count or 0)
		for license, user_licenses_count in licenses
	]

	return {
		"items": result,
	}


@view_config(route_name="license_all_for_manager", renderer="json", permission="manager", request_method="POST")
def license_all_for_manager(request):
	company_id = request.jwt_claims['company_id']
		# .join(Company, Company.id == company_id)\
	rows = request.dbsession.query(Product, License)\
		.join(Product.licenses)\
		.filter(Product.company_id == company_id)\
		.options(joinedload(License.type))\
		.order_by(Product.id.asc(), License.id.desc())\
		.all()

	result = []
	result = [license.as_dict(
		type=license.type.as_dict(),
		product=product.as_dict(),
	) for product, license in rows]

	return {
		"items": result
	}


@view_config(route_name="license_add", renderer="json", permission="manager", request_method="POST", validator=SchemaLicensesAdd())
def license_add(request):
	license = License(**request.data)
	request.dbsession.add(license)

	try:
		request.dbsession.flush()
	except IntegrityError as e:
		raise HTTPConflict({
			"fields": {
				"name": f"Product with name '{request.data.get('name')}' already exists."
			}
		})

	return {
		"success": True,
		"item": license.as_dict(
			usersCount=0,
			type=license.type.as_dict(),
			product=license.product.as_dict(),
		),
	}
