<?php
/**
 * Created by PhpStorm.
 * User: sunshine
 * Date: 26/11/2018
 * Time: 14:03
 */
namespace Faonni\ContactMap\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;

class Anchor implements ArrayInterface
{
    public function toOptionArray()
    {
        return [
            ['value' => 'dynamic', 'label' => __('dynamic')],
            ['value' => 'center', 'label' => __('center')],
            ['value' => 'top', 'label' => __('top')],
            ['value' => 'bottom', 'label' => __('bottom')],
            ['value' => 'left', 'label' => __('left')],
            ['value' => 'right', 'label' => __('right')],
            ['value' => 'top-left', 'label' => __('top-left')],
            ['value' => 'top-right', 'label' => __('top-right')],
            ['value' => 'bottom-left', 'label' => __('bottom-left')],
            ['value' => 'bottom-right', 'label' => __('bottom-right')],
        ];
    }
}
