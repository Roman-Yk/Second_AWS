import datetime as dt
from ..meta import Base, Column, relationship, String, Integer, DateTime


class Activity(Base):
	__tablename__ = "activity"

	id = Column(Integer, primary_key=True)

	hardware_id = Column(String(512), nullable=True)
	product_guid = Column(String(64), nullable=True)
	public_key = Column(String(128), nullable=True)
	ip_address = Column(String(16), nullable=True)
	logged_username = Column(String(128), nullable=True)
	os_name = Column(String(128), nullable=True)
	type = Column(Integer(), nullable=True)
	param_1 = Column(Integer(), nullable=True)
	param_2 = Column(Integer(), nullable=True)

	created_at = Column(DateTime(timezone=False), default=dt.datetime.utcnow)

	def __repr__(self):
		return f"Activity({self.hardware_id}, {self.type})"

	def as_dict(self, **kwargs):
		return {
			"id": self.id,
			"name": self.name,
			"hardware_id": self.hardware_id,
			"product_guid": self.product_guid,
			"public_key": self.public_key,
			"os_name": self.os_name,
			"ip_address": self.ip_address,
			"logged_username": self.logged_username,
			"type": self.type,
			"param_1": self.param_1,
			"param_2": self.param_2,
			"created_at": self.created_at.isoformat(),
			**kwargs
		}
