<?php

/**
 *
 * @package Licenses Server plugin
 *
 */
/*
Plugin Name: Licenses Server Plugin
Plugin URI: http://elsmanleadsoft.eu
Description: Plugin for integrating licenses server
Version: 1.0.0
Author: Elsman Leadsoft
License: MIT
Text Domain: licenses-server
*/

if ( ! defined('ABSPATH') ) {
	die;
}

if (isset($_GET['lang'])) {
	define("LS_LOCALE", $_GET['lang']);
} else {
	define("LS_LOCALE", "en");
}

include_once 'auth.php';
include_once 'shortcodes.php';


class LicensesServer
{
	function __construct() {
		add_action( 'admin_menu', array($this, 'admin_menu') );
		add_action( 'wp_logout', array($this, 'logout') );
		add_action( 'init', array($this, 'user_licenses_start_sessions'), 1);


		// add_action( 'admin_menu', 'uls_api_add_admin_menu' );
		add_action( 'admin_init', 'uls_api_settings_init' );
	}

	function activate() {
		// echo 'Hello activation';
	}

	function deactivate() {
		// echo 'Bye deactivation';
	}

	function uninstall() {

	}

	function logout() {
		reset_user_licenses_server_token();
	}

	function user_licenses_start_sessions() {
		if(!session_id()) {
			session_start();
		}
	}

	function admin_menu() {
		$slug = 'user-licenses';
		$slug_testing = $slug . '_testing';

		add_options_page( 'Licenses Server', 'Licenses Server', 'manage_options', 'licenses-server-serrings', 'uls_api_options_page' );

		add_menu_page(
			__( 'User Licenses', 'licenses-server' ),
			__( 'User Licenses', 'licenses-server' ),
			'manage_options',
			$slug,
			array( $this, 'manager_user_licenses'),
			'dashicons-desktop',
			'55.8'
		);

		// add_submenu_page(
		// 	$slug,
		// 	__( 'Testing', 'licenses-server' ),
		// 	__( 'Testing', 'licenses-server' ),
		// 	'manage_options',
		// 	$slug_testing,
		// 	array( $this, 'manager_user_licenses'),
		// );
	}

	function manager_user_licenses() {
		global $current_user;

		$licenses_server_host = get_licenses_server_host();
		$token = get_user_licenses_server_token($current_user);

		$ifr = $licenses_server_host . '/?locale=' . constant('LS_LOCALE') . '&access_token=' . $token;

		echo "
			<iframe id=\"licenses-server\" frameborder=\"0\"></iframe>
			<style>
				#licenses-server {
					width: 100%;
					box-sizing: border-box;
				}
				#wpcontent {
					padding: 0;
				}
				#wpbody-content {
					padding: 0;
					overflow: hidden !important;
				}
				#wpfooter {
					display: none;
				}
			</style>
			<script>
				var iframe = document.getElementById('licenses-server');
				iframe.src = '$ifr';
				var wpbody = document.getElementById('wpbody-content');

				function resizeIframe() {
					var sideBarHeight = document.getElementById('wpcontent').getBoundingClientRect().height;
					var contentHeight = window.innerHeight - 32;
					var height = Math.max(sideBarHeight, contentHeight) + 'px';
					iframe.style.height = height;
					wpbody.style.height = height;
				}

				window.addEventListener('resize', resizeIframe);
				iframe.addEventListener('load', resizeIframe);
				resizeIframe();
			</script>
		";
	}
}

$licensesServer = new LicensesServer();


register_activation_hook( __FILE__, array( $licensesServer, 'activate' ) );
register_deactivation_hook( __FILE__, array( $licensesServer, 'deactivate' ) );


function uls_api_settings_init(  ) {
    register_setting( 'ulsPlugin', 'uls_api_settings' );
    add_settings_section(
        'uls_api_ulsPlugin_section',
        __( 'Licenses Server settings', 'wordpress' ),
        'uls_api_settings_section_callback',
        'ulsPlugin'
    );

    add_settings_field(
        'uls_api_text_field_address',
        __( 'Licenses Server address', 'wordpress' ),
        'uls_api_text_field_address_render',
        'ulsPlugin',
        'uls_api_ulsPlugin_section'
    );

    add_settings_field(
        'uls_api_text_field_auth_address',
        __( 'Licenses Server Auth address', 'wordpress' ),
        'uls_api_text_field_auth_address_render',
        'ulsPlugin',
        'uls_api_ulsPlugin_section'
    );

    // add_settings_field(
    //     'uls_api_select_field_1',
    //     __( 'Our Field 1 Title', 'wordpress' ),
    //     'uls_api_select_field_1_render',
    //     'ulsPlugin',
    //     'uls_api_ulsPlugin_section'
    // );
}

function uls_api_text_field_address_render(  ) {
    $options = get_option( 'uls_api_settings' );
    ?>
    <input type='text' name='uls_api_settings[uls_api_text_field_address]' value='<?=$options['uls_api_text_field_address']?>'>
    <?php
}

function uls_api_text_field_auth_address_render(  ) {
    $options = get_option( 'uls_api_settings' );
    ?>
    <input type='text' name='uls_api_settings[uls_api_text_field_auth_address]' value='<?=$options['uls_api_text_field_auth_address']?>'>
    <?php
}

function uls_api_select_field_1_render(  ) {
    $options = get_option( 'uls_api_settings' );
    ?>
    <select name='uls_api_settings[uls_api_select_field_1]'>
        <option value='1' <?php selected( $options['uls_api_select_field_1'], 1 ); ?>>Option 1</option>
        <option value='2' <?php selected( $options['uls_api_select_field_1'], 2 ); ?>>Option 2</option>
    </select>

<?php
}

function uls_api_settings_section_callback(  ) {
    echo __( '', 'wordpress' );
}

function uls_api_options_page(  ) {
    ?>
    <form action='options.php' method='post'>

        <?php
	        settings_fields( 'ulsPlugin' );
	        do_settings_sections( 'ulsPlugin' );
	        submit_button();
        ?>

    </form>
    <?php
}






/*
fetch("/index.php\?rest_route\=/wp/v2/users", {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json'
	},
	body: JSON.stringify({
		"username" : "test-2",
		"email": "test-2@gmail.com",
		"password": "test-2",
		"meta": {
			"phone": "0999999999",
			"company_name": "Hello world",
		}
	})
}).then(res => res.json()).then(console.log)
*/


// function add_user_custom_page() {
// 	global $PAGE_ID;
// 	$page_data = array(
// 		'post_status'	=> 'publish',
// 		'post_type'	  => 'page',
// 		'post_author'	=> 1,
// 		'post_name'	  => $PAGE_ID,
// 		'post_title'	 => 'User Licenses',
// 		'post_content'   => 'User Licenses page',
// 		'post_parent'	=> 0,
// 		'comment_status' => 'closed',
// 	);
// 	$wp_page_id = wp_insert_post( $page_data );
// 	update_option( $PAGE_ID, $wp_page_id );
// 	return $wp_page_id;
// }


// function delete_user_custom_page() {
// 	$wp_page = get_page_by_title( 'User Licenses' );
// 	if (!empty($wp_page)) {
// 		wp_delete_post( $wp_page->ID, true );
// 	}
// }


// register_activation_hook(__FILE__, 'add_user_custom_page');
// register_deactivation_hook(__FILE__, 'delete_user_custom_page');
