from ..meta import Column, ForeignKey, Integer, DateTime, relationship
from ..meta import Base

from datetime import datetime


class ComputerCheck(Base):
	__tablename__ = "computer_check"

	id = Column(Integer, primary_key=True)
	computer_id = Column(Integer, ForeignKey("computer.id"), nullable=False)
	time_check = Column(DateTime(timezone=False), default=datetime.utcnow)

	# "got_from_hardware" jsonb;
	# "sent_to_hardware" jsonb;
	# "algorithm_log_info" jsonb;

	computer = relationship("Computer", uselist=False, backref="computer_check")

	def __repr__(self):
		return f"ComputerCheck({self.id}, {self.computer_id})"

	def as_dict(computer_check, **kwargs):
		return {
			"id": computer_check.id,
			"computer_id": computer_check.computer_id,
			"time_check": datetime.timestamp(computer_check.time_check),
			**kwargs
		}
