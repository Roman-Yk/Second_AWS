from ..meta import Column, Integer, String
from ..meta import Base


class ProductFeature(Base):
	__tablename__ = "product_feature"

	id = Column(Integer(), primary_key=True)
	product_id = Column(Integer())
	name = Column(String(16), nullable=False)
	description = Column(String(64), nullable=True)

	def __repr__(self):
		return f"ProductFeature({self.id}, {self.name})"

	def as_dict(self, **kwargs):
		return {
			"id": self.id,
			"product_id": self.product_id,
			"name": self.name,
			"description": self.description,
			**kwargs
		}
