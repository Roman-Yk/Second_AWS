import os
import sys
import transaction

from pyramid.paster import (
	get_appsettings,
	setup_logging,
)

from pyramid.scripts.common import parse_vars

from ..database.meta import Base
from ..database import (
	get_engine,
	get_session_factory,
	get_tm_session,
)


def session_add(session, items):
	print(dir(session))
	for item in items:
		session.add(item)


def usage(argv):
	cmd = os.path.basename(argv[0])
	print('usage: %s <config_uri> [var=value]\n(example: "%s development.ini")' % (cmd, cmd))
	sys.exit(1)


def initialize_all(dbsession, initializers=[]):
	results = {}
	for initializer in initializers:
		result = initializer(dbsession, **results)
		if type(result) == dict:
			results.update(result)
	return results


def initialize_db_with(initializers=[], argv=sys.argv):
	if len(argv) < 2:
		usage(argv)
	config_uri = argv[1]
	options = parse_vars(argv[2:])
	setup_logging(config_uri)
	settings = get_appsettings(config_uri, options=options)

	engine = get_engine(settings)
	Base.metadata.create_all(engine)

	session_factory = get_session_factory(engine)

	with transaction.manager:
		dbsession = get_tm_session(session_factory, transaction.manager)

		init_result = initialize_all(dbsession, initializers)
		# _init_companies(dbsession, transaction.manager)
		# _init_users(dbsession, transaction.manager)
		# _init_licenses(dbsession, transaction.manager)
		# init_all(dbsession, transaction.manager)

		transaction.manager.commit()
	return init_result
