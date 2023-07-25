from licensing.database.meta import Column, ForeignKey, Integer, DateTime, String, relationship, UniqueConstraint, Boolean, Date
from licensing.database.meta import Base

import datetime
import json

# from .User import User
# from .License import License
# from .computer import computer
from licensing.rsa import (
	load_private_key_from_string,
	generate_key_private_string,
	generate_key_public_string
)


def public_from_private(context):
	private_key_string = context.get_current_parameters()['private_key']
	private_key = load_private_key_from_string(private_key_string)
	return generate_key_public_string(private_key)


class UserLicense(Base):
	__tablename__ = "user_license"

	id = Column(Integer, primary_key=True)
	# user_id = Column(Integer, ForeignKey("user__client.id"), nullable=False)
	# user_id = Column(Integer, ForeignKey("wordpress.wp_users.ID"), nullable=False)
	user_id = Column(Integer, nullable=False)
	license_id = Column(Integer, ForeignKey("license.id"), nullable=False)
	is_enabled = Column(Boolean, nullable=False, default=True)

	count = Column(Integer, nullable=False, default=1)
	private_key = Column(String(1024), nullable=False, default=generate_key_private_string, unique=True)
	public_key = Column(String(128), nullable=False, default=public_from_private, unique=True)
	time_created = Column(DateTime(timezone=False), default=datetime.datetime.utcnow)
	time_login = Column(DateTime(timezone=False), default=None)
	expiration_date = Column(Date(), default=None)

	features = Column(String(256), default="[]")

	# user = relationship("Client", uselist=False, backref="user_license", lazy="joined")
	license = relationship("License", uselist=False, backref="user_license", lazy="joined")

	hardwares = relationship("Computer", order_by="Computer.is_active.desc(), Computer.id.desc()")

	__table_args__ = (
		UniqueConstraint('user_id', 'license_id', name='user_license_unique'),
	)

	def __repr__(self):
		return f"UserLicense({self.id}, {self.user_id}, {self.license_id}, {self.count}, {str(self.time_created)[:10]})"

	def as_dict(user_license, **kwargs):
		# if user_license.time_created and user_license.license.trial_days:
		# 	now = datetime.datetime.now()
		# 	trial_expiration_days = user_license.license.trial_days - (now - user_license.time_created).days
		# else:
		# 	trial_expiration_days = 0
		return {
			"id": user_license.id,
			"user_id": user_license.user_id,
			"license_id": user_license.license_id,
			"key": user_license.public_key,
			"count": user_license.count,
			# "time_login": user_license.time_login and user_license.time_login.date().isoformat(),
			"time_login": user_license.time_login and user_license.time_login.strftime("%H:%M %d/%m/%Y"),
			# "time_created": user_license.time_created.date().isoformat(),
			# "time_created": user_license.time_created.date().strftime("%d/%m/%Y"),
			"time_created": user_license.time_created.date().isoformat(),
			# "trial_expiration_days": trial_expiration_days,
			# "expiration_date": user_license.expiration_date and user_license.expiration_date.strftime("%d/%m/%Y"),
			"expiration_date": user_license.expiration_date and user_license.expiration_date.isoformat(),
			"is_enabled": user_license.is_enabled,
			"features": json.loads(user_license.features) if user_license.features else [],
			# "type": user_license.license.license_type.name,
			# "license_id": user_license.license.id,
			**kwargs,
		}
