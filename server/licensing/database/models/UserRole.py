from ..meta import Column, Integer, String
from ..meta import Base


class UserRole(Base):
	__tablename__ = "user_role"

	id = Column(Integer, primary_key=True)
	name = Column(String(16), nullable=False)

	def __repr__(self):
		return f"UserRole({self.id}, {self.name})"

	def as_dict(user_role, **kwargs):
		return {
			"id": user_role.id,
			"name": user_role.name,
			**kwargs
		}
