from .utils import BaseTest
from licensing.api.activation.views import (
    activation_activate,
    activation_check
)

import transaction


class TestActivationSuccessCondition(BaseTest):
    def test_passing_activation_activate(self):
        self.check_computer_is_active(False)
        with transaction.manager:
            activation_result = activation_activate(self.new_request())
            self.assertEqual(activation_result["activated"], True)
        self.check_computer_is_active(True)

    def test_passing_activation_activate_if_is_active(self):
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

        with transaction.manager:
            activation_result = activation_activate(self.new_request(hardware_id=hardware_2["h_id"]))
            self.assertEqual(activation_result["activated"], True)

        with transaction.manager:
            activation_result = activation_activate(self.new_request(hardware_id=hardware_1["h_id"]))
            self.assertEqual(activation_result["activated"], True)

        self.check_computer_is_active(True, hardware_id=hardware_1["id"])
