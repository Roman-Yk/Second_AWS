from ..meta import Column, ForeignKey, Integer, Boolean, String, relationship
from ..meta import Base


class Computer(Base):
    __tablename__ = "computer"

    id = Column(Integer, primary_key=True)
    user_license_id = Column(Integer, ForeignKey("user_license.id"), nullable=False)
    is_active = Column(Boolean)
    is_enabled = Column(Boolean, nullable=False, default=True)

    h_id = Column(String(512), nullable=False, index=True)
    h_description = Column(String(1024))

    user_license = relationship("UserLicense", uselist=False, backref="computer")
    computer_checks = relationship("ComputerCheck")

    ip_address = Column(String(16), nullable=False, default="0.0.0.0")
    logged_username = Column(String(128), nullable=False, default="-")
    os_name = Column(String(128), nullable=False, index=True, default="-")

    def __repr__(self):
        return f"Computer({self.id}, {self.user_license_id}, {self.is_active}, {self.h_id[:6]}..., {self.h_description[:6]}...)"

    def as_dict(computer, **kwargs):
        return {
            "id": computer.id,
            "user_license_id": computer.user_license_id,
            "is_active": computer.is_active,
            "is_enabled": computer.is_enabled,

            "h_id": computer.h_id,
            "h_description": computer.h_description,

            "ip_address": computer.ip_address,
            "logged_username": computer.logged_username,
            "os_name": computer.os_name,

            **kwargs
        }
