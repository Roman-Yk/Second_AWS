def includeme(config):
	config.add_route('user_license_all_by_user', '/user-license/all/by-user')
	config.add_route('user_license_all_by_license', '/user-license/all/by-license')
	config.add_route('user_license_all_my', '/user-license/all/my')

	config.add_route('user_license_add', '/user-license/add')
	config.add_route('user_license_update', '/user-license/update')
	config.add_route('user_license_delete', '/user-license/delete')

	config.add_route('user_license_disable', '/user-license/disable')
	config.add_route('user_license_enable', '/user-license/enable')
