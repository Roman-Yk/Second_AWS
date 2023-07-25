from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.schema import MetaData

from sqlalchemy import (
	Column,
	Index,
	SmallInteger,
	Integer,
	BigInteger,
	String,
	Text,
	Sequence,
	DateTime,
	Boolean,
	ForeignKey,
	UniqueConstraint,
	Date,
	JSON
)

from sqlalchemy.dialects.postgresql import (
	JSONB,
	UUID,
	INET
)

from sqlalchemy.orm import (
	relationship,
	backref
)

# __all__ = [
# 	Column,
# 	Index,
# 	SmallInteger,
# 	Integer,
# 	BigInteger,
# 	String,
# 	Text,
# 	Sequence,
# 	DateTime,
# 	Boolean,
# 	ForeignKey,
# 	UniqueConstraint,
# 	JSON,

# 	relationship,
# 	backref,
# ]


# Recommended naming convention used by Alembic, as various different database
# providers will autogenerate vastly different names making migrations more
# difficult. See: http://alembic.zzzcomputing.com/en/latest/naming.html
NAMING_CONVENTION = {
	"ix": 'ix_%(column_0_label)s',
	"uq": "uq_%(table_name)s_%(column_0_name)s",
	"ck": "ck_%(table_name)s_%(constraint_name)s",
	"fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
	"pk": "pk_%(table_name)s"
}

# metadata = MetaData(naming_convention=NAMING_CONVENTION)
metadata = MetaData()
Base = declarative_base(metadata=metadata)

WORDPRESS_TABLE_PREFIX = "wp6v"

def wp_prefix(table_name):
	return f"{WORDPRESS_TABLE_PREFIX}_{table_name}"