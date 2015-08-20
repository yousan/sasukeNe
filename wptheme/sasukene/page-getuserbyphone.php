<?php
/**
 * Created by IntelliJ IDEA.
 * User: yousan
 * Date: 8/20/15
 * Time: 5:49 PM
 * Template Name: getuserbyphone
 */

?>
<?php
main();

function getUserByPhone($phone) {
    global $wpdb; /** @var wpdb $wpdb */
    $query = "SELECT user_id FROM $wpdb->usermeta
WHERE meta_value = %s AND meta_key like %s ";
    $prepared = $wpdb->prepare($query, $phone, 'phone%');
    $result = $wpdb->get_var($prepared);
    return get_user_by('id', $result);
}

function checkKey($key) {
    $passphrase = 'sharakugekkyuuhiroki';
    if ($key == $passphrase) {
        return true;
    } else {
        return false;
    }
}

function main()
{
    if (!(($phone = @$_GET['phone']) &&
        ($key = @$_GET['key']))) {
        echo 'invalid reference';
        return 1;
    }

    if (!checkKey($key)) {
        echo 'invalid key';
        return 2;
    }
    /** @var WP_User $user */
    $user = getUserByPhone($phone);
    if (!$user) {
        echo 'no user found';
    }
    $geocode = get_user_meta($user->ID, 'geocode', true);
    $ret = explode(',', $geocode);
    echo json_encode($ret);
}
