from ..meta import Column, relationship, String, Integer
from ..meta import Base


class Company(Base):
	__tablename__ = "company"

	id = Column(Integer, primary_key=True)
	name = Column(String(32), unique=True)
	# description = Column(String(512), default="")

	# users = relationship("Manager")
	products = relationship("Product", back_populates="company")

	def __repr__(self):
		return f"Company({self.id}, {self.name})"

	def as_dict(company, **kwargs):
		return {
			"id": company.id,
			"name": company.name,
			# "description": company.description,
			**kwargs
		}
