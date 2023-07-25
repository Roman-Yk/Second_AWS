def includeme(config):
	config.add_route('license_all', '/license/all')
	config.add_route('license_all_for_manager', '/license/all/for-manager')
	config.add_route('license_add', '/license/add')

	config.add_route('license_type_all', '/license/type/all')
