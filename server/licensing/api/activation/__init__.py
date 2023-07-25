def includeme(config):
	config.add_route('activation_check', '/activation/check')
	config.add_route('activation_activate', '/activation/activate')
	config.add_route('activation_deactivate', '/activation/deactivate')
	config.add_route('activation_reactivate', '/activation/reactivate')
