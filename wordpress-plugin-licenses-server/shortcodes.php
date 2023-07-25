<?php


function uls_licenses_shortcode() {
	if ( !is_user_logged_in() ) {
		return '';
	}

	global $current_user;
	$licenses_server_host = get_licenses_server_host();
	$token = get_user_licenses_server_token($current_user);

	$ifr = $licenses_server_host . '/?locale=' . constant('LS_LOCALE') . '&access_token=' . $token;

	return "
		$lin
		<style>
			#licenses-server {
				margin: 0 auto;
				min-height: 800px;
				width: 100%;
			}
		</style>
		<iframe id=\"licenses-server\" frameborder=\"0\"></iframe>
		<script>
			var iframe = document.getElementById(\"licenses-server\");
			iframe.src = '$ifr';
			var wpbody = document.getElementById('wpbody-content');

			setTimeout(function resizeFrame() {
				if (
					iframe.contentWindow.document.body
					&& iframe.height != iframe.contentWindow.document.body.clientHeight
					&& iframe.height < iframe.contentWindow.document.body.clientHeight
				) {
					iframe.height = iframe.contentWindow.document.body.clientHeight;
				}
				setTimeout(resizeFrame, 100)
			}, 100);

		</script>
	";
}

add_shortcode( 'uls-user-licenses', 'uls_licenses_shortcode' );
