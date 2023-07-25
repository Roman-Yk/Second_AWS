# from pyramid.response import Response
from pyramid.view import view_config

import uuid
import datetime as dt
# from licensing.database import UserLicense, Computer
from licensing.database import UserLicense, Computer, ComputerCheck
# from sqlalchemy import func, and_
# from sqlalchemy.orm import aliased

from ..utils import Locker
from ..errors import (
	UserLicenseNotFound,
	ProductNotFound,
	HardwareNotFound,
	UserLicenseIsDisabled,
	UserLicenseIsExpired,
	ComputerIsNotActivated,
	ComputerIsDisabled,
	TooMuchActiveComputers,
	CantFindOldestComputerForDeactivation
)
from .schemas import (
	SchemaActivationWithLog,
	SchemaActivation
)


from .queries import get_data_by_product_and_hardware, get_user_license_active_computers_count


import logging
logger = logging.getLogger()
activation_locker = Locker()


@view_config(route_name="activation_check", renderer="json", request_method="POST", validator=SchemaActivationWithLog())
def activation_check(request):
	"""
	@api {post} /api/activation/check Check License
	@apiName ActivationCheck
	@apiDescription License checking
	@apiGroup Activation
	@apiVersion 1.0.0

	@apiParam {String} hardware_id User unique hardware ID.
	@apiParam {String} product_guid Product GUID.
	@apiParam {String} public_key License key.
	@apiParam {String} ip_address Client computer IP address
	@apiParam {String} logged_username Client computer user name
	@apiParam {String} os_name Client computer operating system name

	@apiSuccess {String} hardware_id User unique hardware ID.
	@apiSuccess {String} product_guid Product GUID.
	@apiSuccess {Boolean} is_active Check result.
	"""
	hardware_hid = request.data["hardware_id"]
	product_guid = request.data["product_guid"]
	public_key = request.data["public_key"]

	ip_address = request.data["ip_address"]
	logged_username = request.data["logged_username"]
	os_name = request.data["os_name"]

	data = get_data_by_product_and_hardware(
		request.dbsession,
		product_guid,
		hardware_hid,
		public_key=public_key,
	)
	product, license, user_license, user, computer = data

	error_result = {}

	if not user_license:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"is_active": False,
			**UserLicenseNotFound
		}

	if not product:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"activated": False,
			**ProductNotFound
		}

	if not user_license.is_enabled:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"is_active": False,
			**UserLicenseIsDisabled
		}

	if user_license.expiration_date and (user_license.expiration_date <= dt.date.today()):
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"is_active": False,
			**UserLicenseIsExpired
		}

	if not computer:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"is_active": False,
			**HardwareNotFound,
		}

	if not computer.is_enabled:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"is_active": False,
			**ComputerIsDisabled,
		}

	computer.ip_address = ip_address
	computer.logged_username = logged_username
	computer.os_name = os_name
	computer.computer_checks.append(
		ComputerCheck()
	)

	return {
		"hardware_id": hardware_hid,
		"product_guid": product_guid,
		"is_active": computer.is_active,
		"features": user_license.features,
		"licensed_to": user.user_email,
		**error_result
	}


@view_config(route_name="activation_activate", renderer="json", request_method="POST", validator=SchemaActivationWithLog())
def activation_activate(request):
	"""
	@api {post} /api/activation/activate Activite License
	@apiName ActivationActivate
	@apiDescription License activation
	@apiGroup Activation
	@apiVersion 1.0.0

	@apiParam {String} hardware_id User unique hardware ID.
	@apiParam {String} product_guid Product GUID.
	@apiParam {String} public_key License key.
	@apiParam {String} ip_address Client computer IP address
	@apiParam {String} logged_username Client computer user name
	@apiParam {String} os_name Client computer operating system name

	@apiSuccess {String} hardware_id User unique hardware ID.
	@apiSuccess {String} product_guid Product GUID.
	@apiSuccess {Boolean} activated Activation result.
	"""
	product_guid = request.data["product_guid"]
	hardware_hid = request.data["hardware_id"]
	public_key = request.data["public_key"]

	ip_address = request.data["ip_address"]
	logged_username = request.data["logged_username"]
	os_name = request.data["os_name"]

	session = request.dbsession

	with activation_locker.by("{product_guid}:{hardware_id}:{public_key}".format(**request.data)):
		data = get_data_by_product_and_hardware(
			session,
			product_guid,
			hardware_hid,
			public_key=public_key,
		)

		product, license, user_license, user, computer = data

		if not user_license:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**UserLicenseNotFound
			}

		if user_license.is_enabled is False:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**UserLicenseIsDisabled
			}

		if user_license.expiration_date and (user_license.expiration_date <= dt.date.today()):
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"is_active": False,
				**UserLicenseIsExpired
			}

		if computer and computer.is_enabled is False:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**ComputerIsDisabled
			}

		if not product:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**ProductNotFound
			}

		if computer and computer.is_active is True:
			computer.ip_address = ip_address
			computer.logged_username = logged_username
			computer.os_name = os_name
			request.dbsession.flush()
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": True,
				"features": user_license.features,
				"licensed_to": user.user_email,
			}

		current_active_computers_count = get_user_license_active_computers_count(
			request.dbsession,
			user_license.id
		)

		if current_active_computers_count >= user_license.count:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**TooMuchActiveComputers
			}

		if not computer:
			computer = Computer(
				user_license=user_license,
				is_active=False,
				h_id=hardware_hid,
				# h_description=str(uuid.uuid1())
				h_description=""
			)
			session.add(computer)
			# session.flush()

		computer.is_active = True
		computer.ip_address = ip_address
		computer.logged_username = logged_username
		computer.os_name = os_name
		computer.computer_checks.append(
			ComputerCheck()
		)
		session.flush()

		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"activated": computer.is_active,
			"features": user_license.features,
			"licensed_to": user.user_email,
		}

	return {
		"hardware_id": hardware_hid,
		"product_guid": product_guid,
		"activated": False,
	}


@view_config(route_name="activation_deactivate", renderer="json", request_method="POST", validator=SchemaActivation())
def activation_deactivate(request):
	"""
	@api {post} /api/activation/deactivate Deactivate License
	@apiName ActivationDeactivate
	@apiDescription License deactivation
	@apiGroup Activation
	@apiVersion 1.0.0

	@apiParam {String} hardware_id User unique hardware ID.
	@apiParam {String} product_guid Product GUID.
	@apiParam {String} public_key License key.

	@apiSuccess {String} hardware_id User unique hardware ID.
	@apiSuccess {String} product_guid Product GUID.
	@apiSuccess {Boolean} activated Deactivation result.
	"""
	product_guid = request.data["product_guid"]
	hardware_hid = request.data["hardware_id"]
	public_key = request.data["public_key"]

	session = request.dbsession

	data = get_data_by_product_and_hardware(
		session,
		product_guid,
		hardware_hid,
		public_key=public_key,
	)

	product, license, user_license, user, computer = data

	if not computer:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"deactivated": False,
			**HardwareNotFound
		}

	if not product:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"deactivated": False,
			**ProductNotFound
		}

	if not user_license:
		return {
			"hardware_id": hardware_hid,
			"product_guid": product_guid,
			"deactivated": False,
			**UserLicenseNotFound
		}

	computer.is_active = False
	session.flush()

	return {
		"hardware_id": hardware_hid,
		"product_guid": product_guid,
		"deactivated": True if not computer.is_active else False,
	}


@view_config(route_name="activation_reactivate", renderer="json", request_method="POST", validator=SchemaActivationWithLog())
def activation_reactivate(request):
	"""
	@api {post} /api/activation/reactivate Reactivate License
	@apiName ActivationReactivate
	@apiDescription License reactivation
	@apiGroup Activation
	@apiVersion 1.0.0

	@apiParam {String} hardware_id User unique hardware ID.
	@apiParam {String} product_guid Product GUID.
	@apiParam {String} public_key License key.
	@apiParam {String} ip_address Client computer IP address
	@apiParam {String} logged_username Client computer user name
	@apiParam {String} os_name Client computer operating system name

	@apiSuccess {String} hardware_id User unique hardware ID.
	@apiSuccess {String} product_guid Product GUID.
	@apiSuccess {Boolean} is_active Reactivation result.
	"""
	hardware_hid = request.data["hardware_id"]
	product_guid = request.data["product_guid"]
	public_key = request.data["public_key"]

	ip_address = request.data["ip_address"]
	logged_username = request.data["logged_username"]
	os_name = request.data["os_name"]

	is_active_result = False
	error_result = {}

	with activation_locker.by("{product_guid}:{hardware_id}:{public_key}".format(**request.data)):
		data = get_data_by_product_and_hardware(
			request.dbsession,
			product_guid,
			hardware_hid,
			public_key=public_key,
		)
		product, license, user_license, user, computer = data

		if not user_license:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"is_active": False,
				**UserLicenseNotFound
			}

		if not product:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"activated": False,
				**ProductNotFound
			}

		if not user_license.is_enabled:
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"is_active": False,
				**UserLicenseIsDisabled
			}

		if user_license.expiration_date and (user_license.expiration_date <= dt.date.today()):
			return {
				"hardware_id": hardware_hid,
				"product_guid": product_guid,
				"is_active": False,
				**UserLicenseIsExpired
			}

		if not computer:
			computer = Computer(
				user_license=user_license,
				is_active=False,
				h_id=hardware_hid,
				# h_description=str(uuid.uuid1())
				h_description=""
			)
			request.dbsession.add(computer)
			# request.dbsession.flush()

		computer.ip_address = ip_address
		computer.logged_username = logged_username
		computer.os_name = os_name

		if computer.is_active:
			is_active_result = True
		else:
			current_active_computers_count = get_user_license_active_computers_count(
				request.dbsession,
				user_license.id
			)

			if current_active_computers_count < user_license.count:
				computer.is_active = True
				computer.computer_checks.append(
					ComputerCheck()
				)
				request.dbsession.flush()
				is_active_result = True
			elif current_active_computers_count >= user_license.count:
				# DEACTIVATE OLDEST COMPUTER
				# ACTIVATE CURRENT COMPUTER
				time_checks_sub = request.dbsession.query(
					Computer.id.label("computer_id"),
					ComputerCheck.id,
					ComputerCheck.time_check,
				)\
					.join(ComputerCheck)\
					.distinct(Computer.id)\
					.order_by(Computer.id, ComputerCheck.id.desc())\
					.filter(
						Computer.user_license_id == computer.user_license_id,
						Computer.is_active == True,
					).subquery()
				ul_oldest_hardware = request.dbsession.query(Computer)\
					.join(
						time_checks_sub,
						time_checks_sub.c.computer_id == Computer.id
					)\
					.order_by(time_checks_sub.c.time_check.asc())\
					.first()
				if ul_oldest_hardware:
					ul_oldest_hardware.is_active = False
					computer.is_active = True
					computer.computer_checks.append(
						ComputerCheck()
					)
					is_active_result = True
					request.dbsession.flush()
				else:
					error_result = CantFindOldestComputerForDeactivation

	return {
		"hardware_id": hardware_hid,
		"product_guid": product_guid,
		"is_active": is_active_result,
		"features": user_license.features,
		"licensed_to": user.user_email,
		**error_result
	}
