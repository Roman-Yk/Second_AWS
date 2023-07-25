from ..meta import Column, ForeignKey, Integer, BigInteger, DateTime, String, relationship, backref
from ..meta import Base, WORDPRESS_TABLE_PREFIX

from datetime import datetime


class WPUserMeta(Base):
    __tablename__ = f"{WORDPRESS_TABLE_PREFIX}_usermeta"
    __table_args__ = {"schema": "wordpress"}

    umeta_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, primary_key=True)
    meta_key = Column(Integer, primary_key=True)
    meta_value = Column(Integer, primary_key=True)

    def __repr__(user_meta):
        return f"WPUserMeta({user_meta.user_id}, {user_meta.meta_key}, {user_meta.meta_value})"

    def as_dict(user, **kwargs):
        return {
            "umeta_id": user.umeta_id,
            "user_id": user.user_id,
            "meta_key": user.meta_key,
            "meta_value": user.meta_value,
            **kwargs,
        }
