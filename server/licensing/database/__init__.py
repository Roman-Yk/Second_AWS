from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import configure_mappers
import zope.sqlalchemy
from pyramid.renderers import JSON
import datetime as dt

# import or define all models here to ensure they are attached to the
# Base.metadata prior to any initialization routines
from .meta import Base
from .models.Company import Company
# from .models.Hardware import Hardware
from .models.License import License
from .models.LicenseType import LicenseType
from .models.Product import Product
from .models.ProductFeature import ProductFeature
# from .models.User import User, Manager, Client
from .models.UserRole import UserRole
from .models.UserLicense import UserLicense
from .models.Computer import Computer
from .models.ComputerCheck import ComputerCheck
from .models.Activity import Activity

from pyramid.scripts.common import parse_vars
from pyramid.paster import get_appsettings
# from pyramid.config import Configurator
import sys
import os

# run configure_mappers after defining all of the models to ensure
# all relationships can be setup
configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    # opts = dict(
    #     (key[len(prefix):], settings[key])
    #     for key in settings
    #     if key.startswith(prefix)
    # )
    # developer:leadsoft@database:5432/licenses
    # url = f"postgresql://{opts['username']}:{opts['password']}@{opts['host']}:{opts['port']/opts['database']}"
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager):
    """
    Get a ``sqlalchemy.orm.Session`` instance backed by a transaction.

    This function will hook the session to the transaction manager which
    will take care of committing any changes.

    - When using pyramid_tm it will automatically be committed or aborted
      depending on whether an exception is raised.

    - When using scripts you should wrap the session in a manager yourself.
      For example::

          import transaction

          engine = get_engine(settings)
          session_factory = get_session_factory(engine)
          with transaction.manager:
              dbsession = get_tm_session(session_factory, transaction.manager)

    """
    dbsession = session_factory()
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession


def custom_json_renderer():
    """
    Return a custom json renderer that can deal with some datetime objects.
    """
    def datetime_adapter(obj, request):
        return obj.isoformat()

    def time_adapter(obj, request):
        return str(obj)

    def Base_adapter(obj, request):
        return obj.as_dict()

    json_renderer = JSON()
    json_renderer.add_adapter(dt.datetime, datetime_adapter)
    json_renderer.add_adapter(dt.date, datetime_adapter)
    json_renderer.add_adapter(dt.time, time_adapter)
    json_renderer.add_adapter(Base, Base_adapter)
    return json_renderer


def includeme(config):
    settings = config.get_settings()
    settings['sqlalchemy.url'] = os.getenv('CONN_STRING', settings['sqlalchemy.url'])
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'
    config.include('pyramid_tm')
    config.add_renderer('json', custom_json_renderer())

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    config.registry['dbsession_factory'] = session_factory

    # make request.dbsession available for use in Pyramid
    config.add_request_method(
        # r.tm is the transaction manager used by pyramid_tm
        lambda r: get_tm_session(session_factory, r.tm),
        'dbsession',
        reify=True
    )
