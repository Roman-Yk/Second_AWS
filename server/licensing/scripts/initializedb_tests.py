from ..database import (
    Computer,
    UserLicense,
    LicenseType,
    UserRole,
    License,
    Company,
    Product
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
    # role_customer = UserRole(name="customer")
    # role_vendor = UserRole(name="vendor")
    session.add_all([role_admin, role_manager, role_client])
    session.flush()

    company_1 = kwargs["companies"]["company_1"]
    company_2 = kwargs["companies"]["company_2"]
    # Create users
    # user_admin = Manager(first_name="Admin", last_name="Admin", phone="0987654321", email="admin@admin.com", password=hash_password("admin"), role_id=role_admin.id)
    # user_manager_1 = Manager(registered_by=1, first_name="Admin", last_name="Manager", phone="0987654321", email="admin@test.dev", password=hash_password("password"), role=role_manager, company_id=company_1["id"])
    # user_manager_2 = Manager(registered_by=1, first_name="Admin", last_name="Test", phone="0987654321", email="test-admin@test.dev", password=hash_password("Test"), role=role_manager, company_id=company_2["id"])

    # user_client_1 = Client(registered_by=2, client_company="Bebuk", first_name="Ivan", last_name="Vasylovskyy", phone="0987654321", email="ivan_vasylovskyy@yahoo.com", password=hash_password("test"), role_id=role_client.id)
    # user_client_2 = Client(registered_by=2, client_company="Bebuk", first_name="Yaroslav", last_name="Nychkalo", phone="0987654321", email="yaroslav_nychkalo@gmail.com", password=hash_password("test"), role_id=role_client.id)
    # user_client_3 = Client(registered_by=2, client_company="Bebuk", first_name="Pavlo", last_name="Test", phone="0987654321", email="pavlo.test@test.dev", password=hash_password("test"), role_id=role_client.id)
    # user_client_4 = Client(registered_by=3, client_company="Test", first_name="CLIENT", last_name="TEST", phone="0987654321", email="client@gmail.com", password=hash_password("test"), role_id=role_client.id)

    session.add_all([
        # user_admin,
        # user_manager_1,
        # user_manager_2,
        # user_client_1,
        # user_client_2,
        # user_client_3,
        # user_client_4,
    ])

    session.flush()

    return {
        "users": {
            # "admin": user_admin.as_dict(),
            # "manager": user_manager_1.as_dict(),
            # "Ivan": user_client_1.as_dict(),
            # "Yaroslav": user_client_2.as_dict(),
            # "Pavlo": user_client_3.as_dict(),
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
    # user_license_1 = UserLicense(user_id=users["Ivan"]["id"], license_id=license_1.id, count=2, time_login=datetime.datetime.utcnow())
    # user_license_2 = UserLicense(user_id=users["Yaroslav"]["id"], license_id=license_1.id, count=2)
    # user_license_3 = UserLicense(user_id=users["Pavlo"]["id"], license_id=license_1.id, count=5)
    # session.add_all([user_license_1, user_license_2, user_license_3])
    # session.flush()

    # computer_1 = Computer(user_license=user_license_1, is_active=False, h_id="ivan_windows-8.1@root", h_description="530b4687-44ce-4daa-9ed3-dd434dc0b8ba", ip_address="192.168.0.100", logged_username="ivan", os_name="windows")
    # computer_2 = Computer(user_license=user_license_2, is_active=False, h_id="yaroslav_windows-10@work", h_description="644f9966-3372-4444-9293-7f474bb800b8", ip_address="192.168.0.101", logged_username="gebeto", os_name="windows")
    # computer_2_1 = Computer(user_license=user_license_2, is_active=False, h_id="yaroslav_windows-10@work22", h_description="744f9966-3372-4444-9293-7f474bb800b8", ip_address="192.168.0.101", logged_username="gebeto", os_name="windows")
    # computer_2_2 = Computer(user_license=user_license_2, is_active=False, h_id="yaroslav_windows-10@work23", h_description="844f9966-3372-4444-9293-7f474bb800b8", ip_address="192.168.0.101", logged_username="gebeto", os_name="windows")
    # computer_3 = Computer(user_license=user_license_3, is_active=False, h_id="pavlo_windows-7@root", h_description="bcf7235c-7a60-48d5-9cfc-9c405f90664c", ip_address="162.55.33.241", logged_username="pavlo", os_name="windows")
    # session.add_all([
    #     computer_1,
    #     computer_2,
    #     computer_2_1,
    #     computer_2_2,
    #     computer_3,
    # ])

    session.flush()

    return {
        "user_licenses": {
            # "user_license_1": user_license_1.as_dict(public_key=user_license_1.public_key),
            # "user_license_2": user_license_2.as_dict(public_key=user_license_2.public_key),
            # "user_license_3": user_license_3.as_dict(public_key=user_license_3.public_key),
        },

        "computers": {
            # "computer_1": computer_1.as_dict(),
            # "computer_2": computer_2.as_dict(),
            # "computer_2_1": computer_2_1.as_dict(),
            # "computer_2_2": computer_2_2.as_dict(),
            # "computer_3": computer_3.as_dict(),
        }
    }


def _init_companies(session, **kwargs):
    # Add Companies
    company_1 = Company(name="Test Company")
    company_2 = Company(name="Test inc.")
    session.add_all([
        company_1,
        company_2,
    ])
    session.flush()

    product_1 = Product(company_id=company_1.id, name="Test Connect", description="American Test Company", guid="e5231d32-176d-11ea-96bf-0242ac140004", software_url="#")
    product_2 = Product(company_id=company_2.id, name="Test Product", description="Product for testing", guid="11111111-1111-1111-1111-111111111111", software_url="#")
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
