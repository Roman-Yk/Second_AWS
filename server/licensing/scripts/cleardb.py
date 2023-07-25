import sys

from pyramid.paster import (
    get_appsettings,
    setup_logging
)

from pyramid.scripts.common import parse_vars

from ..database.meta import Base
from ..database import (
    get_engine,
    )

from .utils import usage


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = get_engine(settings)
    Base.metadata.drop_all(engine)
