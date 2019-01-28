<?php
/**
 * Copyright © 2011-2018 Karliuka Vitalii(karliuka.vitalii@gmail.com)
 *
 * See COPYING.txt for license details.
 */

namespace Faonni\ContactMap\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\UrlInterface;
use Faonni\ContactMap\Helper\Data as ContactMapHelper;

/**
 * Popup Block
 */
class Popup extends Template
{
    /**
     * Helper
     *
     * @var \Faonni\ContactMap\Helper\Data
     */
    protected $_helper;

    protected $storeInfoBlock;

    /**
     * Initialize Block
     *
     * @param Context $context
     * @param ContactMapHelper $helper
     * @param StoreInformation
     * @param array $data
     */
    public function __construct(
        Context $context,
        ContactMapHelper $helper,
        StoreInformation $storeInfoBlock,
        array $data = []
    )
    {
        $this->_helper = $helper;
        $this->storeInfoBlock = $storeInfoBlock;

        parent::__construct($context, $data);
    }

    /**
     * Check if the map popup is enabled
     *
     * @return bool
     */
    public function isEnabled()
    {
        return $this->_helper->isEnabled() && $this->_helper->isPopupEnabled();
    }

    /**
     * Returns the formatted address for the store
     *
     * @return string
     */
    public function getFormattedAddress(){
        return $this->getStoreInformation()->getFormattedAddress();
    }

    /**
     * Returns the URL to view store address directions
     * 
     * @return string
     */
    public function getDirectionsURL(){
        $markerPosition = $this->_helper->getMarkerPosition();

        return sprintf(
            'https://www.google.com/maps/place/%s/@%s,%s,%dz',
            urlencode($this->getStoreInformation()->getAddressInline()),
            $markerPosition['lat'],
            $markerPosition['lng'],
            17
        );
    }

    /**
     * Returns the StoreInformation block
     *
     * @return StoreInformation
     */
    protected function getStoreInformation(){
        return $this->storeInfoBlock;
    }

    /**
     * Returns whether we should show the address in the popup or not
     * 
     * @return bool
     */
    public function showAddress(){
        return !!$this->getShow_address();
    }

    /**
     * Allows passing through any method calls for getting popup properties, without
     * having to define getters for each one.
     *
     * ie.
     * `$this->getContent()`
     * will return the `content` field value of the popup
     *
     * @param string $method
     * @param array $args
     * @return mixed
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function __call($method, $args)
    {
        if(substr($method, 0, 3) === 'get'){
            return $this->_helper->getPopupConfig()[substr(strtolower($method), 3)] ?? null;
        }

        return parent::__call($method, $args);
    }
}
