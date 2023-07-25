# from pyramid.response import Response
from pyramid.view import view_config

from sqlalchemy.orm import joinedload

from licensing.database import UserLicense, Computer

from .schemas import (
	SchemaComputersById,
	SchemaComputersUpdateDescription,
	SchemaComputersGetByUserLicense
)


# @view_config(route_name="computer_all", renderer="json", permission="manager", request_method="POST")
# def computer_all(request):
# 	user_license = request.dbsession.query(UserLicense)\
# 		.options(
# 			joinedload("hardwares").joinedload("hardware")
# 		)\
# 		.get(1)
# 	items = [{
# 		"id": i.id,
# 		"is_active": i.is_active,
# 	} for i in user_license.hardwares]
# 	return {
# 		"items": items
# 	}


@view_config(route_name="computer_all_by_user_license", renderer="json", permission="client", request_method="POST", validator=SchemaComputersGetByUserLicense())
def computer_all_by_user_license(request):
	user_license_id = request.data['user_license_id']
	ulh = request.dbsession.query(Computer)\
		.filter(Computer.user_license_id == user_license_id)\
		.order_by(Computer.is_active.desc(), Computer.id.desc())\
		.all()

	return {
		"items": [i.as_dict() for i in ulh]
	}


@view_config(route_name="computer_update_description", renderer="json", permission="client", request_method="POST", validator=SchemaComputersUpdateDescription())
def computer_update_description(request):
	computer_id = request.data['id']
	computer_h_description = request.data['h_description']

	ulh = request.dbsession.query(Computer).get(computer_id)
	ulh.h_description = computer_h_description
	request.dbsession.flush()

	return {
		"success": True,
		"item": ulh.as_dict()
	}


@view_config(route_name="computer_disable", renderer="json", permission="manager", request_method="POST", validator=SchemaComputersById())
def computer_disable(request):
	computer_id = request.data['computer_id']

	ulh = request.dbsession.query(Computer).get(computer_id)
	ulh.is_enabled = False
	ulh.is_active = False
	request.dbsession.flush()

	return {
		"success": True,
		"item": ulh.as_dict()
	}


@view_config(route_name="computer_enable", renderer="json", permission="manager", request_method="POST", validator=SchemaComputersById())
def computer_enable(request):
	computer_id = request.data['computer_id']

	ulh = request.dbsession.query(Computer).get(computer_id)
	ulh.is_enabled = True
	ulh.is_active = False
	request.dbsession.flush()

	return {
		"success": True,
		"item": ulh.as_dict()
	}


def deactivate_hardware(request, computer_id, by_user_id=None):
	sub = request.dbsession.query(UserLicense.id, UserLicense.user_id, UserLicense.count).subquery("t")

	query = request.dbsession.query(Computer).with_for_update()

	if by_user_id:
		query = query.filter(sub.c.user_id == by_user_id)
		# Computer.user_license_id == sub.c.id,

	query = query.filter(
		Computer.id == computer_id,
		# Computer.user_license_id == sub.c.id,
	)

	is_updated = query.update({
		Computer.is_active: False
	}, synchronize_session=False)

	request.dbsession.flush()

	return is_updated


@view_config(route_name="computer_deactivate_by_id", renderer="json", permission="manager", request_method="POST", validator=SchemaComputersById())
def computer_deactivate_by_id(request):
	computer_id = request.data["computer_id"]
	computer = request.dbsession.query(Computer).get(computer_id)
	if computer:
		computer.is_active = False
		request.dbsession.flush()
	return {
		"success": not computer.is_active,
		"item": computer,
	}


@view_config(route_name="computer_deactivate_my_by_id", renderer="json", permission="client", request_method="POST", validator=SchemaComputersById())
def computer_deactivate_my_by_id(request):
	computer_id = request.data["computer_id"]
	computer = request.dbsession.query(Computer).get(computer_id)
	if computer:
		computer.is_active = False
		request.dbsession.flush()
	return {
		"success": not computer.is_active,
		"item": computer
	}
