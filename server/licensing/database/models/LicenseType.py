from ..meta import Column, String, Integer
from ..meta import Base


class LicenseType(Base):
	__tablename__ = "license_type"

	id = Column(Integer, primary_key=True)
	name = Column(String(32), nullable=False)

	def __repr__(self):
		return f"LicenseType({self.id}, {self.name})"

	def as_dict(license_type, **kwargs):
		return {
			"id": license_type.id,
			"name": license_type.name,
			**kwargs
		}
