<?php
/**
 * Created by PhpStorm.
 * User: sunshine
 * Date: 26/11/2018
 * Time: 14:03
 */
namespace Faonni\ContactMap\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;

class MapType implements ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'google', 'label' => __('Google Map')],
            ['value' => 'mapbox', 'label' => __('MapBox')],
        ];
    }
}
