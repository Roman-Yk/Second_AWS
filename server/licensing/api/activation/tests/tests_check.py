from .utils import BaseTest
from licensing.api.activation.views import (
    activation_activate,
    activation_deactivate,
    activation_check
)

from licensing.api.user_license.views import (
    user_license_disable,
    user_license_enable
)

import transaction


class TestCheckSuccessCondition(BaseTest):
    def test_passing_activation_check(self):
        self.check_computer_is_active(False)

        # Activation
        with transaction.manager:
            activation_result = activation_activate(self.new_request())
            self.assertEqual(activation_result["activated"], True)

        # Check if active
        with transaction.manager:
            checking_result = activation_check(self.new_request())
            self.assertEqual(checking_result["is_active"], True)

        # Deactivation
        with transaction.manager:
            deactivation_result = activation_deactivate(self.new_request())
            self.assertEqual(deactivation_result["deactivated"], True)

        # Check if active
        with transaction.manager:
            checking_result = activation_check(self.new_request())
            self.assertEqual(checking_result["is_active"], False)

        self.check_computer_is_active(False)

    def test_passing_activation_check_disabled_user_license(self):
        self.check_computer_is_active(False)

        # Disable computer
        with transaction.manager:
            disabling_result = user_license_disable(
                self.request_post({
                    "user_license_id": self.user_license_id
                })
            )
            self.assertEqual(disabling_result["success"], True)

        # Activation
        with transaction.manager:
            activation_result = activation_activate(self.new_request())
            self.assertEqual(activation_result["activated"], False)
            self.assertEqual(activation_result["error_id"], 8)

        # Check if active
        with transaction.manager:
            checking_result = activation_check(self.new_request())
            self.assertEqual(checking_result["is_active"], False)
            self.assertEqual(checking_result["error_id"], 8)

        # Deactivation
        with transaction.manager:
            deactivation_result = activation_deactivate(self.new_request())
            self.assertEqual(deactivation_result["deactivated"], True)

        # Check if active
        with transaction.manager:
            checking_result = activation_check(self.new_request())
            self.assertEqual(checking_result["is_active"], False)

        self.check_computer_is_active(False)
