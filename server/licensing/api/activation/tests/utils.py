import unittest
import transaction

from pyramid import testing
from licensing.database.meta import Base
from pyramid.paster import get_appsettings

from licensing.database import Computer
from licensing.database import (
    get_engine,
    get_session_factory,
    get_tm_session,
)


from licensing.scripts.initializedb_tests import main as init_oregon_database


def dummy_request(dbsession, json_body={}):
    return testing.DummyRequest(
        tm=transaction.manager,
        dbsession=dbsession,
        json_body=json_body,
        data=json_body,
    )


class BaseTest(unittest.TestCase):
    def setUp(self):
        settings = get_appsettings("testing.ini", options=[])
        self.config = testing.setUp(settings=settings)
        self.config.include('licensing.database')
        settings = self.config.get_settings()
        self.engine = get_engine(settings)
        self.init_database()

    @property
    def new_session(self):
        return self.get_session()

    def get_session(self):
        session_factory = get_session_factory(self.engine)
        return get_tm_session(session_factory, transaction.manager)

    def init_database(self):
        Base.metadata.drop_all(self.engine)

        init_result = init_oregon_database(argv=["pytest", "testing.ini", "withdata=1"])
        self.init_result = init_result
        self.init_activation_data(init_result)

        transaction.manager.commit()

    def init_activation_data(self, init_result):
        users = init_result["users"]
        products = init_result["products"]
        user_licenses = init_result["user_licenses"]
        computers = init_result["computers"]
        self.user_id = users["Yaroslav"]["id"]
        self.product_guid = products["product_1"]["guid"]
        self.user_license_public_key = user_licenses["user_license_2"]["public_key"]
        self.user_license_id = computers["computer_2"]["user_license_id"]
        self.computer_id = computers["computer_2"]["id"]
        self.computer_hid = computers["computer_2"]["h_id"]

        self.activation_data = {
            "hardware_id": self.computer_hid,
            "public_key": self.user_license_public_key,
            "product_guid": self.product_guid,
            "ip_address": "0.0.0.0",
            "logged_username": "-",
            "os_name": "-",
        }

    def tearDown(self):
        testing.tearDown()
        transaction.abort()
        Base.metadata.drop_all(self.engine)

    def request_post(self, json_body):
        return dummy_request(self.new_session, json_body=json_body)

    def new_request(self, **override_activation_data):
        return self.request_post({**self.activation_data, **override_activation_data})

    def get_computer(self, hardware_id=None):
        self_session = self.get_session()
        data = self_session.query(Computer).get(hardware_id or self.computer_id)
        return data

    def check_computer_is_active(self, is_active, **kwargs):
        ulh = self.get_computer(**kwargs)
        self.assertEqual(ulh.is_active, is_active)
