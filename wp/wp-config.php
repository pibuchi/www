<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true);
define( 'WPCACHEHOME', '/nfco/www/wp/wp-content/plugins/wp-super-cache/' );
define( 'DB_NAME', 'nfco' );

/** Database username */
define( 'DB_USER', 'nfco' );

/** Database password */
define( 'DB_PASSWORD', 'jinho6196**' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'Es.gjpZp_$kO^h/S2()wRJ>`9Xb=>(ZP q=w+11?<[xx{2f0!6Vd~7RqMBpU!YPG' );
define( 'SECURE_AUTH_KEY',   'kS5HweR@EF$E*|Ec$DgublVoS(ZhR_L4hcsfv8[Hiqq{[-@uRlV<QS.TF}p+HM9|' );
define( 'LOGGED_IN_KEY',     'VDCqfr>8z,KQ%?1errI>geJf,FJC0CS]lB>mzJaPs>jo1HQ0 c/Z8{eg&u$hxhd[' );
define( 'NONCE_KEY',         'vr+JM$.Nl0z(00K)d8l`x9mVW9t`8Uf4p w]AqW6!Q3-d%l27 fWn?8o|=]vqNs ' );
define( 'AUTH_SALT',         'o&)2zbz,<hJB|`h~}LuIbq.t|H3|DA:r-L<k|@f*DiGWj2vlx|UcsgaLr9Q.J-/4' );
define( 'SECURE_AUTH_SALT',  '-DzJ4aVK4nb1U4SiOAfz9UdB4SMSSt>&j+-e{3NnjqI%JrSXP`5wXq(i|p{mH[a-' );
define( 'LOGGED_IN_SALT',    'l??EC~)R^MPP] e[2Zj(I_-eh)[$`K3;,19 w-UocbddOA <NbW )XDv!O|c/qQ3' );
define( 'NONCE_SALT',        'c2A7:.t5zkB&eGwD@z8V,0QmqR~c~#P4<z4CxC/*2GiUn.sJ^^Vz:9G?dXT/OKS,' );
define( 'WP_CACHE_KEY_SALT', '!Vao?],VVlHxeKr8JHz*&1H!UtHX%*d ROp2nF?6E!!/9Dg(tw;nbkSu<pkq@tO`' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */

// 사이트 기본 언어 설정
define( 'WPLANG', 'ko_KR' );

// 디버그 설정
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

/* custom security setting */
define('DISALLOW_FILE_EDIT', true);
define('IMAGE_EDIT_OVERWRITE', true);
define('EMPTY_TRASH_DAYS', 7);


/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
