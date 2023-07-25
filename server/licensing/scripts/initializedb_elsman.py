from ..database import (
    Computer,
    UserLicense,
    LicenseType,
    UserRole,
    License,
    Company,
    Product,
    # User,
    # Manager,
    # Client
)
from licensing.api.auth.security import hash_password
from .utils import initialize_db_with, initialize_all

import datetime
import sys


def _init_users(session, **kwargs):
    # Create roles
    role_admin = UserRole(name="admin")
    role_manager = UserRole(name="manager")
    role_client = UserRole(name="client")
    session.add_all([role_admin, role_manager, role_client])
    session.flush()

    company_1 = kwargs["companies"]["company_1"]
    company_2 = kwargs["companies"]["company_2"]
    # Create users
    # user_admin = Manager(role_id=role_admin.id)
    # user_manager_1 = Manager(registered_by=1, role_id=role_manager.id, company_id=company_1["id"])

    # user_client_1 = Client(registered_by=2, client_company="Elsman", role_id=role_client.id)
    # user_client_2 = Client(registered_by=2, client_company="Elsman", role_id=role_client.id)
    # user_client_3 = Client(registered_by=2, client_company="Elsman", role_id=role_client.id)
    # user_client_4 = Client(registered_by=3, client_company="Test", role_id=role_client.id)

    # session.add_all([
    #     user_admin,
    #     user_manager_1,
    #     user_client_1,
    #     user_client_2,
    #     user_client_3,
    #     user_client_4,
    # ])

    # session.flush()

    return {
        "users": {
            # "admin": user_admin.as_dict(),
            # "manager": user_manager_1.as_dict(),
            # "Ivan": user_client_1.as_dict(),
            # "Nard": user_client_2.as_dict(),
            # "JrNard": user_client_3.as_dict(),
        }
    }


def _init_licenses(session, **kwargs):
    # Add License types
    license_type_permanent = LicenseType(name="Permanent")
    license_type_subscription = LicenseType(name="Subscription")
    session.add_all([
        license_type_permanent,
        license_type_subscription,
    ])
    session.flush()

    products = kwargs.get('products')
    license_1 = License(name="All features", product_id=products["product_1"]["id"], type_id=license_type_subscription.id, trial_days=30)
    session.add_all([license_1])
    session.flush()

    # users = kwargs.get('users')
    # user_license_1 = UserLicense(user_id=users["Ivan"]["id"], license=license_1, count=2, time_login=datetime.datetime.utcnow())
    # session.add_all([user_license_1])
    # session.flush()

    # computer_1 = Computer(user_license=user_license_1, is_active=True, h_id="ivan_windows-8.1@root", h_description="530b4687-44ce-4daa-9ed3-dd434dc0b8ba", ip_address="192.168.0.100", logged_username="ivan", os_name="windows")
    # session.add_all([
    #     computer_1,
    # ])

    # session.flush()

    return {
        "user_licenses": {
            # "user_license_1": user_license_1.as_dict(public_key=user_license_1.public_key),
        },

        "computers": {
            # "computer_1": computer_1.as_dict(),
        }
    }


def _init_companies(session, **kwargs):
    # Add Companies
    company_1 = Company(name="Elsman Soft")
    company_2 = Company(name="Test inc.")
    session.add_all([
        company_1,
        company_2,
    ])
    session.flush()

    product_1 = Product(company=company_1, name="Diamond FMS", description="Diamond FMS", guid="c25dfe14-690e-469f-b9ee-56402c59b349", software_url="#")
    product_2 = Product(company=company_2, name="Test Product", description="Product for testing", guid="11111111-1111-1111-1111-111111111111", software_url="#")
    session.add_all([
        product_1,
        product_2,
    ])
    session.flush()

    return {
        "products": {
            "product_1": product_1.as_dict(),
            "product_2": product_2.as_dict(),
        },
        "companies": {
            "company_1": company_1.as_dict(),
            "company_2": company_2.as_dict(),
        }
    }


def main(**kwargs):
    return initialize_db_with([
        _init_companies,
        _init_users,
        _init_licenses,
    ], **kwargs)
