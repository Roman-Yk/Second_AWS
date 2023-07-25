def includeme(config):
	config.add_route('user_me', '/user/me')

	# config.add_route('user_update_password', '/user/update-password')
	config.add_route('user_search', '/user/search')
	config.add_route('user_search_ignore_license_users', '/user/search/ignore-license-users')

	config.add_route('client_all', '/client/all')
	config.add_route('client_all_for_license', '/client/for-license')
	# config.add_route('client_add', '/client/add')
	# config.add_route('client_update', '/client/update')
	# config.add_route('client_delete', '/client/delete')

	# config.add_route('manager_all', '/manager/all')
	# config.add_route('manager_add', '/manager/add')
	# config.add_route('manager_delete', '/manager/delete')
