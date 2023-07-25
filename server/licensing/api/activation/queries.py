from licensing.database import UserLicense, Computer, Product, License
from licensing.database.wordpress.WPUser import WPUser
from sqlalchemy import and_, func
from sqlalchemy.orm import aliased

def debug_all(query, title="DEBUG"):
	print(f"\n\n>>>>>> {title} >>>>>>\n", "\n".join([str(s) for s in query.all()]))
	print("\n")

def get_data_by_product_and_hardware_2(session, product_guid, hardware_hid, public_key=None):
	ul_sub = session.query(UserLicense).filter(UserLicense.public_key == public_key).subquery("ul")
	UserLicenseSub = aliased(UserLicense, ul_sub)

	comp_sub = session.query(Computer).filter(Computer.h_id == hardware_hid).subquery("c")
	ComputerSub = aliased(Computer, comp_sub)

	query = session.query(Product, License, UserLicenseSub, WPUser, ComputerSub)\
		.filter(Product.guid == product_guid)

	query = query.join(License, License.product_id == Product.id)
	query = query.outerjoin(UserLicenseSub, UserLicenseSub.license_id == License.id)
	query = query.outerjoin(WPUser, WPUser.id == UserLicenseSub.user_id)
	query = query.outerjoin(ComputerSub, ComputerSub.user_license_id == UserLicenseSub.id)
	query = query.order_by(
		License.id.desc(),
		UserLicenseSub.id.desc(),
		WPUser.id.desc(),
		ComputerSub.id.desc()
	)
	# print("ULIS >>>>>>", "\n".join([str(s) for s in query.all()]))

	data = query.first()

	if data:
		return data

	# return product, license, user_license, computer
	return None, None, None, None, None


def get_data_by_product_and_hardware(session, product_guid, hardware_hid, public_key=None):
	comp_sub = session.query(Computer).filter(Computer.h_id == hardware_hid).subquery("c")
	ComputerSub = aliased(Computer, comp_sub)

	prod_sub = session.query(Product).filter(Product.guid == product_guid).subquery("p")
	ProductSub = aliased(Product, prod_sub)

	query = session.query(UserLicense, License, ProductSub, ComputerSub, WPUser)\
		.filter(UserLicense.public_key == public_key)

	query = query.outerjoin(License, UserLicense.license_id == License.id)
	query = query.outerjoin(ProductSub, ProductSub.id == License.product_id)
	query = query.outerjoin(WPUser, WPUser.id == UserLicense.user_id)
	query = query.outerjoin(ComputerSub, ComputerSub.user_license_id == UserLicense.id)
	# debug_all(query)

	data = query.first()

	if data:
		user_license, license, product, computer, user = data
		return product, license, user_license, user, computer

	# return product, license, user_license, user, computer
	return None, None, None, None, None


def get_user_license_active_computers_count(session, user_license_id):
	active_user_computers = session.query(Computer.user_license_id, func.count(Computer.id).label('count'))\
		.filter_by(
			user_license_id=user_license_id,
			is_active=True,
			is_enabled=True,
		)\
		.group_by(Computer.user_license_id)\
		.first()

	user_license_id, current_active_count = active_user_computers or (user_license_id, 0)

	return current_active_count
