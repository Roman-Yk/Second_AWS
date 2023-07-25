# from sqlalchemy import ( Column, Index, SmallInteger, Integer, BigInteger, String, Text, Sequence, DateTime, Boolean, JSON )
from ..meta import Column, ForeignKey, Integer, Integer, Integer, String, relationship
from ..meta import Base

# from .product import product
# from .license_type import license_type
# from .user_license import user_license


class License(Base):
	__tablename__ = "license"

	id = Column(Integer, primary_key=True)
	name = Column(String(64), nullable=False)
	product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
	type_id = Column(Integer, ForeignKey("license_type.id"), nullable=False)
	trial_days = Column(Integer)

	initial_features = Column(String(256), default="[]")

	type = relationship("LicenseType", uselist=False)

	# users = relationship("Client", secondary="user_license", backref="license")
	product = relationship("Product", back_populates="licenses")

	def __repr__(self):
		return f"License({self.id}, {self.product_id}, {self.type_id}, {self.trial_days})"

	def as_dict(license, **kwargs):
		return {
			"id": license.id,
			"name": license.name,
			"type_id": license.type_id,
			"product_id": license.product_id,
			"trial_days": license.trial_days,
			**kwargs,
			# "createdTime": user_license.time_created.strftime("%H:%M %d/%m/%Y"),
		}
