from ..meta import Column, ForeignKey, Integer, BigInteger, DateTime, String, relationship, backref
from ..meta import Base, WORDPRESS_TABLE_PREFIX

from datetime import datetime


class WPUser(Base):
    __tablename__ = f"{WORDPRESS_TABLE_PREFIX}_users"
    __table_args__ = {"schema": "wordpress"}

    id = Column("ID", Integer, primary_key=True)
    user_login = Column(String(60))
    user_pass = Column(String(255))
    user_email = Column(String(100))

    # user_registration_user_company_name

    # @property
    # def id(self):
    #     return self.ID

    def __repr__(user):
        return f"WPUser({user.id}, {user.user_login}, {user.user_pass}, {user.user_email})"

    def as_dict(user, **kwargs):
        return {
            "id": user.id,
            "user_login": user.user_login,
            "user_email": user.user_email,
            **kwargs,
        }
