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
use Magento\MediaStorage\Helper\File\Storage\Database as StorageHelper;
use Faonni\ContactMap\Helper\Data as ContactMapHelper;

/**
 * Map Block
 */
class Map extends Template
{
    /**
     * Helper
     *
     * @var \Faonni\ContactMap\Helper\Data
     */
    protected $_helper;

    /**
     * Media Storage Helper
     *
     * @var \Magento\MediaStorage\Helper\File\Storage\Database
     */
    protected $_fileStorageHelper;

    /**
     * Initialize Block
     *
     * @param Context $context
     * @param StorageHelper $fileStorageHelper
     * @param ContactMapHelper $helper
     * @param array $data
     */
    public function __construct(
        Context $context,
        StorageHelper $fileStorageHelper,
        ContactMapHelper $helper,
        array $data = []
    )
    {
        $this->_fileStorageHelper = $fileStorageHelper;
        $this->_helper = $helper;
        parent::__construct($context, $data);
    }

    /**
     * Check ContactMap Functionality Should Be Enabled
     *
     * @return bool
     */
    public function isEnabled()
    {
        return $this->_helper->isEnabled();
    }

    /**
     * Retrieve Map Api Key
     *
     * @return string
     */
    public function getApiKey()
    {
        return $this->_helper->getApiKey();
    }

    /**
     * Returns all of the config values, with map type specific ones merged in
     *
     * @return array
     */
    public function getMapConfig(){
        return array_merge(
            [
                'map_type' => $this->getMapType(),
                'zoom' => $this->getZoom(),
            ],
            $this->getMapTypeConfig()
        );
    }

    /**
     * Returns the type of map to be displayed (ie. Google, MapBox)
     *
     * @return null|string
     */
    public function getMapType()
    {
        return $this->_helper->getMapType();
    }

    /**
     * Returns all of the config values for the given map type
     *
     * @return array
     */
    public function getMapTypeConfig()
    {
        return $this->_helper->getMapTypeConfig();
    }

    /**
     * Retrieve Marker Icon
     *
     * @return string
     */
    public function getMarkerIcon()
    {
        return $this->_helper->getMarkerIcon();
    }

    /**
     * Retrieve Marker Icon Url
     *
     * @return string
     */
    public function getMarkerIconSrc()
    {
        if ($this->getMarkerIcon()) {
            $folderName = 'contact/map/marker';
            $path = $folderName . '/' . $this->getMarkerIcon();
            if ($this->_isFile($path)) {
                return $this->_urlBuilder
                        ->getBaseUrl(['_type' => UrlInterface::URL_TYPE_MEDIA]) . $path;
            }
        }
        return null;
    }

    /**
     * Retrieve Marker Data as a base64 encoded JSON string
     *
     * @return string
     */
    public function getMarkerData()
    {
        $markerData = $this->_helper->getMarkerData();

        $marker = [
            'position' => $this->_helper->getMarkerPosition(),
            'options' => [
                'icon' => $this->getMarkerIconSrc() ?: null,
                'color' => $markerData['color'],
            ],
        ];

        return base64_encode(json_encode([$marker]));
    }

    /**
     * Retrieve Map Zoom
     *
     * @return int
     */
    public function getZoom()
    {
        return $this->_helper->getZoom();
    }

    /**
     * If Db File Storage Is On - Find There, Otherwise - Just file_exists
     *
     * @param string $filename
     * @return bool
     */
    protected function _isFile($filename)
    {
        if ($this->_fileStorageHelper->checkDbUsage() &&
            !$this->getMediaDirectory()->isFile($filename)) {
            $this->_fileStorageHelper->saveFileToFilesystem($filename);
        }
        return $this->getMediaDirectory()->isFile($filename);
    }
}
