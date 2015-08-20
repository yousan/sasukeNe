<?php
/**
 * Created by IntelliJ IDEA.
 * User: yousan
 * Date: 8/19/15
 * Time: 8:09 PM
 */


add_action( 'wp_enqueue_scripts', function() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
});

/**
 * JSファイルを読み込ませる
 */
add_action( 'wp_enqueue_scripts', function() {
    $pagename = get_query_var('pagename');
    if (get_query_var('pagename') == 'register') {
        wp_enqueue_script( $pagename, get_bloginfo('stylesheet_directory').'/js/'.$pagename.'.js', array('jquery'), '1.0');
        wp_enqueue_script('maps.google', 'http://maps.google.com/maps/api/js?sensor=false');
    }
    if ($pagename = get_query_var('pagename')) {
        if (file_exists(get_stylesheet_directory().'/js/'.$pagename.'.js')) {
            wp_enqueue_script( $pagename, get_bloginfo('stylesheet_directory').'/js/'.$pagename.'.js');
        }
    }
});
