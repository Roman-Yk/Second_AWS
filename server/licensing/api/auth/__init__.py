from pyramid.security import ALL_PERMISSIONS
from pyramid.security import Allow
from pyramid.security import Authenticated

from pyramid.renderers import get_renderer

# from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.session import SignedCookieSessionFactory
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy


SECRET_KEY = 'SUPER_SECRET_KEKEY_4'


class Root(object):
	__acl__ = [
		(Allow, Authenticated, 'navigate'),
		(Allow, 'g:client', ('client', 'navigate')),
		(Allow, 'g:manager', ('manager', 'client', 'navigate')),
		(Allow, 'g:admin', ALL_PERMISSIONS),
	]

	def __init__(self, request):
		self.request = request


def groupfinder_jwt(userid, request):
	role = request.jwt_claims.get('user_role')
	if role:
		return ['g:{}'.format(role)]
	return None

def groupfinder_session(userid, request):
	role = request.jwt_claims.get('user_role')
	if role:
		return ['g:{}'.format(role)]
	return None


def auth_jwt(config):
	config.include('pyramid_jwt')
	config.set_jwt_authentication_policy(SECRET_KEY, callback=groupfinder_jwt, token_getter=lambda r: r.GET.get('access_token'))


def auth_session(config):
	authn_policy = AuthTktAuthenticationPolicy(SECRET_KEY, callback=groupfinder_session)
	config.set_authentication_policy(authn_policy)


def includeme(config):
	authz_policy = ACLAuthorizationPolicy()
	session_factory = SignedCookieSessionFactory(SECRET_KEY, timeout=3 * 60 * 60)

	config.set_authorization_policy(authz_policy)
	config.set_session_factory(session_factory)

	config.include(auth_jwt)
	# config.add_route('login_jwt', '/login')
	# config.add_route('login_session', '/login')
	# config.include(auth_session)

	config.set_root_factory(Root)

	config.add_route('auth_backend', '/auth-backend')
	config.add_route('status', '/status')

	# config.add_route('update_last_login_time', '/update_last_login_time')
	# config.add_route('logout', '/logout')

	# config.add_route('registration', '/registration')

	config.scan()
