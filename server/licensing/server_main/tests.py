import unittest
import transaction

from pyramid import testing


# def dummy_request(dbsession):
#     return testing.DummyRequest(dbsession=dbsession)


# class BaseTest(unittest.TestCase):
#     def setUp(self):
#         self.config = testing.setUp(settings={
#             'sqlalchemy.url': 'sqlite:///:memory:'
#         })
#         self.config.include('.database')
#         settings = self.config.get_settings()

#         from .database import (
#             get_engine,
#             get_session_factory,
#             get_tm_session,
#         )

#         self.engine = get_engine(settings)
#         session_factory = get_session_factory(self.engine)

#         self.session = get_tm_session(session_factory, transaction.manager)

#     def init_database(self):
#         from .database.meta import Base
#         Base.metadata.create_all(self.engine)

#     def tearDown(self):
#         from .database.meta import Base

#         testing.tearDown()
#         transaction.abort()
#         Base.metadata.drop_all(self.engine)


# class TestMyViewSuccessCondition(BaseTest):

#     def setUp(self):
#         super(TestMyViewSuccessCondition, self).setUp()
#         self.init_database()

#         from .database import MyModel

#         model = MyModel(name='one', value=55)
#         self.session.add(model)

#     def test_passing_view(self):
#         from .views.default import my_view
#         info = my_view(dummy_request(self.session))
#         self.assertEqual(info['one'].name, 'one')
#         self.assertEqual(info['project'], 'licensing')


# class TestMyViewFailureCondition(BaseTest):

#     def test_failing_view(self):
#         from .views.default import my_view
#         info = my_view(dummy_request(self.session))
#         self.assertEqual(info.status_int, 500)


# from licensing.database import User, Company
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

# some_engine = create_engine('postgresql://195.234.5.189/licenses?user=developer&password=leadsoft')
# Session = sessionmaker(bind=some_engine)
# session = Session()
# # User
# # query = session.query(User)
# # users = query.all()
# # print(users)

# myobject = Company(Name='Gebeto Inc.')
# session.add(myobject)
# session.commit()

# # print(User)
