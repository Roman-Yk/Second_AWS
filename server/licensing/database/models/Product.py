from ..meta import Column, ForeignKey, relationship, Integer, String
from ..meta import Base
import uuid


class Product(Base):
	__tablename__ = "product"

	id = Column(Integer, primary_key=True)
	name = Column(String(64), nullable=False)
	description = Column(String(128))
	company_id = Column(Integer, ForeignKey("company.id"), nullable=False)
	guid = Column(String(64), nullable=False, default=lambda: str(uuid.uuid1()), unique=True)

	software_version = Column(String(16), nullable=False, default="0.0.0")
	software_url = Column(String(512), nullable=False, default="#")

	company = relationship("Company", back_populates="products")
	licenses = relationship("License")
	# licenses = relationship("license", lazy="joined")
	# licenses = relationship("license")
	# backref = db.backref('posts', lazy='dynamic')

	def __repr__(product):
		return f"Product({product.id}, {product.name}, {product.guid}, {product.company_id})"

	def as_dict(product, **kwargs):
		return {
			"id": product.id,
			"guid": product.guid,
			"name": product.name,
			"description": product.description,
			"software_url": product.software_url,
			"software_version": product.software_version,
			**kwargs
		}
