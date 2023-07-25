from ..meta import Column, ForeignKey, Integer, BigInteger, DateTime, String, relationship, backref
from ..meta import Base

from datetime import datetime

from ..wordpress import WPUser

# from .UserRole import UserRole
# from .Company import Company
# from .UserLicense import UserLicense


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    # first_name = Column(String(32), nullable=False)
    # last_name = Column(String(32), nullable=False)
    # email = Column(String(64), nullable=False, unique=True)
    # phone = Column(String(10))
    # password = Column(String(128), nullable=False)

    # time_registered = Column(DateTime(timezone=False), nullable=False, default=datetime.utcnow)
    # time_last_login = Column(DateTime(timezone=False), nullable=False, default=datetime.utcnow)
    # time_last_login = Column(DateTime(timezone=False), default=None)

    role_id = Column(Integer, ForeignKey("user_role.id"))
    role = relationship("UserRole", uselist=False)

    # registrator = relationship("User", remote_side=[id])
    registered_by = Column(Integer, ForeignKey("user.id"), default=None)
    # registrations = relationship("User", backref=backref('registrator', remote_side=[id]))
    # registrations = relationship("User")

    __mapper_args__ = {
        'polymorphic_identity': 1,
        'polymorphic_on': role_id,
    }

    def __repr__(user):
        return f"User({user.id}, {user.phone}, {user.role_id})"

    def as_dict(user, **kwargs):
        return {
            "id": user.id,
            # "email": user.email,
            # "phone": user.phone,
            # "name": f"{user.first_name} {user.last_name}",
            # "first_name": user.first_name,
            # "last_name": user.last_name,
            **kwargs,
        }


class Manager(User):
    __tablename__ = "user__manager"

    id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    company_id = Column(Integer, ForeignKey("company.id"))
    company = relationship("Company", uselist=False)

    __mapper_args__ = {
        'polymorphic_identity': 2,
    }

    def as_dict(manager, **kwargs):
        return {
            **super(Manager, manager).as_dict(),
            "company_id": manager.company_id,
            **kwargs,
        }


class Client(User):
    __tablename__ = "user__client"

    id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    # licenses = relationship("License", secondary="user_license", backref="user")
    client_company = Column(String(128), default=None)

    __mapper_args__ = {
        'polymorphic_identity': 3,
    }

    def as_dict(client, **kwargs):
        return {
            **super(Client, client).as_dict(),
            "client_company": client.client_company,
            **kwargs,
        }
