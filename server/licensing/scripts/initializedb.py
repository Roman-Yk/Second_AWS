from ..database import Company, Product, UserRole, LicenseType, License

from licensing.api.auth.security import hash_password

from .utils import initialize_db_with


def _init_users(session, tm, **kwargs):
    # Create roles
    role_admin = UserRole(name="admin")
    role_manager = UserRole(name="manager")
    role_client = UserRole(name="client")
    session.add_all([role_admin, role_manager, role_client])
    session.flush()

    # Create users
    # user_admin = User(first_name="Admin", last_name="Admin", email="admin@admin.com", password=hash_password("admin"), role_id=role_admin.id)
    # user_manager_1 = User(registered_by=1, first_name="John", last_name="Doe", email="manager1@gmail.com", password=hash_password("manager"), role_id=role_manager.id, company_id=1)
    # user_manager_2 = User(registered_by=1, first_name="Steven", last_name="Doe", email="manager2@gmail.com", password=hash_password("manager"), role_id=role_manager.id, company_id=1)
    # user_manager_3 = User(registered_by=1, first_name="Andrew", last_name="Doe", email="manager3@gmail.com", password=hash_password("manager"), role_id=role_manager.id, company_id=2)
    # user_client_1 = User(registered_by=2, first_name="Client1", last_name="Client1", email="client1@client.com", password=hash_password("client"), role_id=role_client.id)
    # user_client_2 = User(registered_by=2, first_name="Client2", last_name="Client2", email="client2@client.com", password=hash_password("client"), role_id=role_client.id)
    # user_client_3 = User(registered_by=3, first_name="Client3", last_name="Client3", email="client3@client.com", password=hash_password("client"), role_id=role_client.id)

    # session.add_all([
    #     user_admin,
    #     user_manager_1, user_manager_2, user_manager_3,
    #     user_client_1, user_client_2, user_client_3
    # ])

    # session.flush()

    return {
        "users": {
            # "Client1": user_client_1,
            # "Client2": user_client_2,
            # "Client3": user_client_3,
            # "Manager1": user_manager_1,
            # "Manager2": user_manager_2,
            # "Manager3": user_manager_3,
            # "Admin": user_admin,
        }
    }


def _init_licenses(session, tm, **kwargs):
    # Add License types
    license_type_permanent = LicenseType(name="Permanent")
    license_type_subscription = LicenseType(name="Subscription")
    session.add_all([
        license_type_permanent,
        license_type_subscription,
    ])
    session.flush()

    license_1 = License(name="All features", product_id=1, type_id=license_type_permanent.id, trial_days=10)
    license_1_1 = License(name="Basic Features", product_id=1, type_id=license_type_subscription.id)
    license_2 = License(name="All features", product_id=2, type_id=license_type_subscription.id)

    # users = kwargs.get('users')
    # license_1.users.append(users["Client1"])
    # license_2.users.append(users["Client1"])
    # license_2.users.append(users["Client2"])
    # license_2.users.append(users["Client3"])

    session.add_all([license_1, license_1_1, license_2])
    session.flush()


def _init_companies(session, tm, **kwargs):
    # Add Companies
    session.add_all([
        Company(name="Company 1"),  # , description="American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. It is considered one of the Big Four tech companies along with Amazon, Google, and Facebook."),
        Company(name="Company 2"),  # , description="American multinational technology company with headquarters in Redmond, Washington."),
        Company(name="Company 3"),  # , description="American multinational information technology company headquartered in Armonk, New York, with operations in over 170 countries."),
    ])
    session.flush()
    # tm.commit()

    session.add_all([
        Product(company_id=1, name="MacOS", description="Desktop operational system for Macbooks/iMacs computers"),
        Product(company_id=1, name="iOS", description="Mobile operational system for iPhones/iPads/iPods"),
        Product(company_id=1, name="tvOS", description="TV operational system for Apple TV"),

        Product(company_id=2, name="Windows", description="Really bad operation system for PC"),
        Product(company_id=3, name="Watson", description="Quantum computer"),
    ])
    session.flush()
    # tm.commit()


def init_all(session, tm, **kwargs):
    funcs = globals().items()
    for name, func in funcs:
        if name.startswith("_init_"):
            print(f"INIT ||| {name}")
            func(session, tm, **kwargs)


def test(*args, **kwargs):
    print(args, kwargs)


def main(**kwargs):
    return initialize_db_with([
        _init_companies,
        _init_users,
        _init_licenses,
    ], **kwargs)
