from .utils import BaseTest
from ...errors import HardwareNotFound
from licensing.api.activation.views import (
    activation_activate,
    activation_reactivate,
    activation_deactivate,
    activation_check
)

import transaction


class TestReactivationSuccessCondition(BaseTest):
    def test_passing_activation_reactivate(self):
        hardwares = self.init_result["computers"]
        hardware_1 = hardwares["computer_2"]
        hardware_2 = hardwares["computer_2_1"]
        hardware_3 = hardwares["computer_2_2"]

        self.check_computer_is_active(False, hardware_id=hardware_1["id"])
        self.check_computer_is_active(False, hardware_id=hardware_2["id"])
        self.check_computer_is_active(False, hardware_id=hardware_3["id"])

        with transaction.manager:
            activation_result = activation_activate(self.new_request(hardware_id=hardware_1["h_id"]))
            self.assertEqual(activation_result["activated"], True)

        with transaction.manager:
            activation_result = activation_activate(self.new_request(hardware_id=hardware_2["h_id"]))
            self.assertEqual(activation_result["activated"], True)

        with transaction.manager:
            activation_result = activation_activate(self.new_request(hardware_id=hardware_3["h_id"]))
            self.assertEqual(activation_result["activated"], False)

        new_computer_hid = "gebeto-test-computer_hid"
        with transaction.manager:
            check_result = activation_check(self.new_request(hardware_id=new_computer_hid))
            self.assertEqual(check_result["is_active"], False)
            self.assertEqual(check_result["error_id"], HardwareNotFound["error_id"])

        with transaction.manager:
            reactivation_result = activation_reactivate(self.new_request(hardware_id=new_computer_hid))
            self.assertEqual(reactivation_result["is_active"], True)

        with transaction.manager:
            check_result = activation_check(self.new_request(hardware_id=new_computer_hid))
            self.assertEqual(check_result["is_active"], True)

        with transaction.manager:
            check_result = activation_check(self.new_request(hardware_id=hardware_1["h_id"]))
            self.assertEqual(check_result["is_active"], False)

        self.check_computer_is_active(False, hardware_id=hardware_1["id"])
        self.check_computer_is_active(True, hardware_id=hardware_2["id"])
        self.check_computer_is_active(False, hardware_id=hardware_3["id"])
