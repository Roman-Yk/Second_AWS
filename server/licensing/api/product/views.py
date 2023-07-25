from pyramid.view import view_config
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from licensing.database import Product, Company, License, ProductFeature

from ..exceptions import HTTPConflict
from .schemas import (
	SchemaProductAdd,
	SchemaProductById
)


@view_config(route_name="product_all", renderer="json", permission="manager", request_method="POST")
def product_all(request):
	rows = request.dbsession.query(
		Product,
		func.count(License.id)
	)\
		.filter(Company.id == request.jwt_claims["company_id"])\
		.outerjoin(Product.licenses)\
		.join(Company)\
		.group_by(Product)\
		.order_by(Product.id.desc())\
		.all()

	result = []
	result = [
		product.as_dict(
			licensesCount=product_licenses_count or 0
		)
		for product, product_licenses_count in rows
	]

	return {
		"items": result
	}


@view_config(route_name="product_add", renderer="json", permission="manager", request_method="POST", validator=SchemaProductAdd())
def product_add(request):
	company_id = request.jwt_claims.get('company_id')
	company = request.dbsession.query(Company).get(company_id)
	product = Product(**request.data)
	company.products.append(product)
	request.dbsession.flush()

	try:
		request.dbsession.flush()
	except IntegrityError:
		raise HTTPConflict({
			"fields": {
				"name": "Product with name '{}' already exists.".format(request.data.get('name'))
			}
		})

	return {
		"success": True,
		"item": product.as_dict(licensesCount=0)
	}


@view_config(route_name="product_delete", renderer="json", permission="admin", request_method="POST", validator=SchemaProductById())
def product_delete(request):
	company_id = request.jwt_claims.get('company_id')
	product_id = request.data['product_id']

	product = request.dbsession.query(Product).get(product_id)
	if product and product.company_id == company_id:
		request.dbsession.delete(product)
		request.dbsession.flush()
	else:
		return {
			"message": "This product is not owned by your company.",
			"success": False,
		}

	return {
		"success": True,
	}


@view_config(route_name="product_features_all", renderer="json", permission="manager", request_method="POST", validator=SchemaProductById())
def product_features_all(request):
	items = request.dbsession.query(ProductFeature).filter(ProductFeature.product_id == request.data["product_id"]).all()

	return {
		"items": items
	}
