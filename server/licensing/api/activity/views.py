from pyramid.response import Response
from pyramid.view import view_config

import uuid
import datetime as dt
from licensing.database import Activity

from .schemas import (
	SchemaActivityTracker,
)


@view_config(route_name="activity_tracker", request_method="POST", validator=SchemaActivityTracker())
def activity_tracker(request):
	"""
	@api {post} /api/activity/tracker Activity Tracker
	@apiName Activity Tracker
	@apiDescription Activity Tracker
	@apiGroup Activity Tracker
	@apiVersion 1.0.0

	@apiParam {String} hardware_id User unique hardware ID.
	@apiParam {String} product_guid Product GUID.
	@apiParam {String} public_key License key.
	@apiParam {String} ip_address Client computer IP address
	@apiParam {String} logged_username Client computer user name
	@apiParam {String} os_name Client computer operating system name
	@apiParam {Integer} type Activity type
	@apiParam {Integer} param_1 Activity param 1
	@apiParam {Integer} param_2 Activity param 2

	@apiSuccess {Boolean} Response code
	"""
	hardware_hid = request.data["hardware_id"]
	product_guid = request.data["product_guid"]
	public_key = request.data["public_key"]
	ip_address = request.data["ip_address"]
	logged_username = request.data["logged_username"]
	os_name = request.data["os_name"]
	_type = request.data["type"]
	param_1 = request.data["param_1"]
	param_2 = request.data["param_2"]

	item = Activity(
		hardware_id=hardware_hid,
		product_guid=product_guid,
		public_key=public_key,
		ip_address=ip_address,
		logged_username=logged_username,
		os_name=os_name,

		type=_type,
		param_1=param_1,
		param_2=param_2,
	)

	request.dbsession.add(item)

	return Response(body="")
