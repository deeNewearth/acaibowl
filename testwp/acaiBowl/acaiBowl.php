<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://newearthart.tech
 * @since             1.0.0
 * @package           AcaiBowl
 *
 * @wordpress-plugin
 * Plugin Name:       AcaiBowl
 * Plugin URI:        https://newearthart.tech
 * Description:       Allows Pages and Posts to have gated access using AcaiBowl
 * Version:           1.0.0
 * Author:            AcaiBowl team ETH Denver 2022
 * Author URI:        https://newearthart.tech
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       AcaiBowl
 * Domain Path:       /languages
 */

//xdebug_break();

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'AcaiBowl_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-AcaiBowl-activator.php
 */
function activate_AcaiBowl() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-AcaiBowl-activator.php';
	AcaiBowl_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-AcaiBowl-deactivator.php
 */
function deactivate_AcaiBowl() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-AcaiBowl-deactivator.php';
	AcaiBowl_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_AcaiBowl' );
register_deactivation_hook( __FILE__, 'deactivate_AcaiBowl' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-AcaiBowl.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_AcaiBowl() {

	$plugin = new AcaiBowl();
	$plugin->run();

}
run_AcaiBowl();
