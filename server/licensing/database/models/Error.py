from ..meta import Column, Integer, String
from ..meta import Base


class User(Base):
    __tablename__ = "error"

    id = Column(Integer, primary_key=True)
    message = Column(String(1024), nullable=False)

    def __repr__(error):
        return f"Error({error.id}, '{error.message}')"

    def as_dict(error, **kwargs):
        return {
            "id": error.id,
            "message": error.message,
            **kwargs,
        }
