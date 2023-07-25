<?php

// define('LICENSES_SERVER_BACKEND', 'http://backend:8000/');
// define('LICENSES_SERVER_HOST', '/licenses');


function get_licenses_server_host() {
	$options = get_option( 'uls_api_settings' );
    return $options['uls_api_text_field_address'];
	// return constant('LICENSES_SERVER_HOST');
}

function get_licenses_server_auth_host() {
	$options = get_option( 'uls_api_settings' );
    return $options['uls_api_text_field_auth_address'];
	// return constant('LICENSES_SERVER_HOST');
}


function fetch_user_licenses_server_token($user) {
	$ur = get_licenses_server_auth_host() . '/api/auth-backend';
	for ($i = 0; $i < 3; $i++) {
		$token_response = wp_remote_post($ur, array(
			'body' => array(
				'id' => $user->ID,
				'company_id' => 1,
				'secret' => 'e428923d-e17e-43c7-821c-23dda1c04031'
			)
		));
		$code = wp_remote_retrieve_response_code( $token_response );
		// echo "LOOP: $i - $code ";
		if ($code == 200) break;
	}
	if ($code != 200) {
		$token = null;
	} else {
		$token = $token_response['body'];
	}
	// echo 'Asdasdasdas' . $token;
	$_SESSION['licenses_server_token'] = $token;
	return $token;
}


function get_user_licenses_server_token($user, $force_update_token = False) {
	$token = $_SESSION['licenses_server_token'];

	if ($force_update_token || empty($token)) {
		$token = fetch_user_licenses_server_token($user);
	}

	return $token;
}

function reset_user_licenses_server_token() {
	session_start();
	// session_unset();
	unset($_SESSION['licenses_server_token']);
}
