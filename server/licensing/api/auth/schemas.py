import deform
import colander


class TextInputWidget(deform.widget.TextInputWidget):
	template = "input.pt"


class PasswordInputWidget(deform.widget.PasswordWidget):
	template = "password.pt"


myPasswordWidget = PasswordInputWidget(attributes={"autocomplete": "password"})
myEmailWidget = TextInputWidget(attributes={"autocomplete": "email", "type": "email", "autofocus": "yes"})


def email_preparer(value):
	return value.lower()


class Bootstrap4Form(deform.widget.FormWidget):
	template = "form.pt"
	mapping_item = "mapping_item.pt"


class SchemaLogin(colander.Schema):
	email = colander.SchemaNode(colander.String(), required=True, preparer=email_preparer)
	password = colander.SchemaNode(colander.String(), required=True)


class BackendAuthSchema(colander.Schema):
	id = colander.SchemaNode(colander.Integer(), required=True)
	secret = colander.SchemaNode(colander.String(), required=True)
	company_id = colander.SchemaNode(colander.Integer(), required=True)
