def includeme(config):
	# config.add_route('computer_all', '/computer/all')
	config.add_route('computer_all_by_user_license', '/computer/all/by-user-license')
	config.add_route('computer_update_description', '/computer/update-description')
	config.add_route('computer_disable', '/computer/disable')
	config.add_route('computer_enable', '/computer/enable')

	config.add_route('computer_deactivate_by_id', '/computer/deactivate-by-id')
	config.add_route('computer_deactivate_my_by_id', '/computer/deactivate-my-by-id')
