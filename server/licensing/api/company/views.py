from pyramid.view import view_config
from sqlalchemy.exc import IntegrityError

from licensing.database import Company

from ..exceptions import HTTPConflict
from .schemas import (
	SchemaCompanyAdd,
	SchemaCompanyById
)


@view_config(route_name="company_all", renderer="json", permission="admin", request_method="POST")
def company_all(request):
	query = request.dbsession.query(Company).order_by(Company.id.asc())
	data = query.all()
	items = [{
		"id": i.id,
		"name": i.name,
	} for i in data]
	return {
		"items": items
	}


@view_config(route_name="company_add", renderer="json", permission="admin", request_method="POST", validator=SchemaCompanyAdd())
def company_add(request):
	company = Company(**request.data)
	request.dbsession.add(company)

	try:
		request.dbsession.flush()
	except IntegrityError:
		raise HTTPConflict({
			"fields": {
				"name": "Company with name '{}' already exists.".format(request.data['name'])
			}
		})

	return {
		"success": True,
		"item": company.as_dict(),
	}


@view_config(route_name="company_delete", renderer="json", permission="admin", request_method="POST", validator=SchemaCompanyById())
def company_delete(request):
	company_id = request.data['company_id']

	product = request.dbsession.query(Company).get(company_id)
	request.dbsession.delete(product)
	request.dbsession.flush()

	return {
		"success": True,
	}
