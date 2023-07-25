from .utils import BaseTest
from licensing.api.activation.views import (
    activation_activate,
    activation_reactivate,
    activation_deactivate,
    activation_check
)

import transaction


class TestDeactivationSuccessCondition(BaseTest):
    def test_passing_activation_deactivate(self):
        self.check_computer_is_active(False)

        with transaction.manager:
            deactivation_result = activation_deactivate(self.new_request())
            self.assertEqual(deactivation_result["deactivated"], True)

        with transaction.manager:
            check_result = activation_check(self.new_request())
            self.assertEqual(check_result["is_active"], False)

        with transaction.manager:
            check_result = activation_check(self.new_request())
            self.assertEqual(check_result["is_active"], False)

        self.check_computer_is_active(False)
