import colander
import re

re_email = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9\-.]+$)"
re_email_compiled = re.compile(re_email, re.I)
email_validator = colander.Regex(re_email_compiled, "Invalid email address")

re_phone = r"(^[0-9]{10}$)"
re_phone_compiled = re.compile(re_phone, re.I)
phone_validator = colander.Regex(re_phone_compiled, "Number length should be 10 digits")


class SchemaUserBase(colander.Schema):
	first_name = colander.SchemaNode(colander.String(), validator=colander.Length(min=3, max=32), required=True)
	last_name = colander.SchemaNode(colander.String(), validator=colander.Length(min=3, max=32), required=True)
	email = colander.SchemaNode(colander.String(), validator=email_validator, required=True)
	phone = colander.SchemaNode(colander.String(), validator=phone_validator, required=True)


class SchemaUserCreate(SchemaUserBase):
	password = colander.SchemaNode(colander.String(), required=True)
	repeat_password = colander.SchemaNode(colander.String(), required=True)

	def validator(self, form, values):
		if values["password"] != values["repeat_password"]:
			exc = colander.Invalid(form)
			exc["repeat_password"] = "Passwords don't match"
			raise exc


class SchemaManagerCreate(SchemaUserCreate):
	company_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaClientCreate(SchemaUserCreate):
	client_company = colander.SchemaNode(colander.String(), validator=colander.Length(min=3, max=128), required=False, missing=None)


class SchemaClientUpdate(SchemaUserBase):
	id = colander.SchemaNode(colander.Integer(), required=True)
	client_company = colander.SchemaNode(colander.String(), validator=colander.Length(min=3, max=128), required=False, missing=None)
	new_password = colander.SchemaNode(colander.String(), required=False, missing=None)


class SchemaClientsForLicense(colander.Schema):
	license_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaUserSearch(colander.Schema):
	term = colander.SchemaNode(colander.String(), required=True, missing='')


class SchemaUserUpdatePassword(colander.Schema):
	current_password = colander.SchemaNode(colander.String(), required=True)
	new_password = colander.SchemaNode(colander.String(), required=True)
	new_password_repeat = colander.SchemaNode(colander.String(), required=True)

	def validator(self, form, values):
		if values["new_password"] != values["new_password_repeat"]:
			exc = colander.Invalid(form)
			exc["new_password"] = ""
			exc["new_password_repeat"] = "Passwords don't match"
			raise exc


class SchemaUserSearchLicenseUsersIgnore(SchemaUserSearch):
	license_id = colander.SchemaNode(colander.Integer(), required=True)


class SchemaUserById(SchemaUserSearch):
	user_id = colander.SchemaNode(colander.Integer(), required=True)
