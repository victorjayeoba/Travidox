<?php
/*
Plugin Name: Custom Delivery Fee by Distance and Equipment
Description: Adds a delivery fee based on distance and product category for WooCommerce.
Version: 1.0
Author: Abdul
*/

// 1. Convert full address to coordinates using Google Maps API
function get_latlng_from_full_address($address) {
    // Use transients to cache geocoding results
    $cache_key = 'geocode_' . md5($address);
    $cached_result = get_transient($cache_key);
    
    if ($cached_result !== false) {
        return $cached_result;
    }
    
    $api_key = 'AIzaSyB6tS1ARNXDQf3p2ZSVYeIT-d04t5rKah0';
    $encoded_address = urlencode($address . ', France');
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=$encoded_address&key=$api_key";

    $response = wp_remote_get($url, ['timeout' => 5]);
    if (is_wp_error($response)) return false;

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    $result = $data['results'][0]['geometry']['location'] ?? false;
    
    // Cache the result for 7 days if valid
    if ($result) {
        set_transient($cache_key, $result, 7 * DAY_IN_SECONDS);
    }
    
    return $result;
}

// 2. Calculate distance using Haversine formula
function get_distance_km($lat1, $lon1, $lat2, $lon2) {
    $earth_radius = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    
    $lat1 = deg2rad($lat1);
    $lat2 = deg2rad($lat2);
    
    $a = sin($dLat/2)**2 + cos($lat1) * cos($lat2) * sin($dLon/2)**2;
    return $earth_radius * (2 * atan2(sqrt($a), sqrt(1 - $a)));
}

// 3. Get equipment type from cart
function get_equipment_type_from_cart() {
    static $equipment_type = null;
    
    // Return cached result if already calculated in this request
    if ($equipment_type !== null) {
        return $equipment_type;
    }
    
    foreach (WC()->cart->get_cart() as $item) {
        $product = $item['data'];
        if (!method_exists($product, 'has_term')) continue;

        if ($product->has_term('heavy', 'product_cat')) {
            $equipment_type = 'heavy';
            return $equipment_type;
        }
        if ($product->has_term('standard', 'product_cat')) {
            $equipment_type = 'standard';
            return $equipment_type;
        }
    }
    $equipment_type = 'light'; // Default type
    return $equipment_type;
}

// 4. Calculate delivery price
function calculate_delivery_price($distance_km, $equipment_type) {
    // Define these as constants to avoid recreating arrays on each function call
    static $handling_fees = ['light' => 10, 'standard' => 30, 'heavy' => 60];
    static $rates = ['light' => 0.5, 'standard' => 0.5, 'heavy' => 0.8];
    
    return round(($distance_km * 2 * $rates[$equipment_type]) + $handling_fees[$equipment_type], 2);
}

// 5. Apply custom delivery fee when "local delivery" is selected
add_action('woocommerce_cart_calculate_fees', 'apply_custom_delivery_fee_based_on_address', 10);
function apply_custom_delivery_fee_based_on_address($cart) {
    if (is_admin() && !defined('DOING_AJAX')) return;
    if (!is_checkout() && !is_cart() && !defined('WOOCOMMERCE_CHECKOUT')) return;

    // Only calculate once per page load
    static $fee_applied = false;
    if ($fee_applied) return;
    
    $chosen_methods = WC()->session->get('chosen_shipping_methods');
    if (empty($chosen_methods) || strpos($chosen_methods[0], 'local_delivery') === false) return;

    // Define constants for origin coordinates
    static $origin_lat = 43.2971; // Idron
    static $origin_lng = -0.3469;
    static $min_distance = 25; // Free delivery under this distance
    static $max_distance = 50; // Too far beyond this distance

    $customer = WC()->customer;
    $address_parts = [
        $customer->get_shipping_address(),
        $customer->get_shipping_address_2(),
        $customer->get_shipping_city(),
        $customer->get_shipping_postcode()
    ];
    $full_address = implode(', ', array_filter($address_parts));
    
    // Skip if address is empty
    if (empty(trim($full_address))) return;

    $destination = get_latlng_from_full_address($full_address);
    if (!$destination) return;

    $distance_km = get_distance_km($origin_lat, $origin_lng, $destination['lat'], $destination['lng']);

    if ($distance_km < $min_distance) return; // free
    if ($distance_km > $max_distance) return; // too far

    $equipment_type = get_equipment_type_from_cart();
    $fee = calculate_delivery_price($distance_km, $equipment_type);
    $cart->add_fee('Delivery Fee', $fee);
    
    $fee_applied = true;
}
