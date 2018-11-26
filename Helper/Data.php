<?php
/**
 * Copyright © 2011-2018 Karliuka Vitalii(karliuka.vitalii@gmail.com)
 * 
 * See COPYING.txt for license details.
 */
namespace Faonni\ContactMap\Helper;

use Magento\Store\Model\ScopeInterface;
use Magento\Framework\App\Helper\AbstractHelper;

/**
 * ContactMap Helper
 */
class Data extends AbstractHelper
{
    /**
     * Enabled Config Path
     */
    const XML_CONTACTMAP_ENABLED = 'contact_map/map/enabled';
    	
    /**
     * Latitude Config Path
     */
    const XML_CONTACTMAP_LATITUDE = 'contact_map/map_details/latitude';

    /**
     * Longitude Config Path
     */
    const XML_CONTACTMAP_LONGITUDE = 'contact_map/map_details/longitude';

    /**
     * Zoom Level Config Path
     */
    const XML_CONTACTMAP_ZOOM = 'contact_map/map_details/zoom';
 
    /**
     * Api Key Config Path
     */
    const XML_CONTACTMAP_API_KEY = 'contact_map/map_type_%s/api_key';

    /**
     * Marker Image Config Path
     */
    const XML_CONTACTMAP_MARKER = 'contact_map/map_details/marker';

    /**
     * Map Type Config Path
     */
    const XML_CONTACTMAP_TYPE = 'contact_map/map/map_type';
 	
    /**
     * Check ContactMap Functionality Should Be Enabled
     *
     * @return bool
     */
    public function isEnabled()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_ENABLED) && $this->getApiKey();
    }

    /**
     * Returns the type of map to be displayed (ie. Google, MapBox)
     *
     * @return null|string
     */
    public function getMapType()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_TYPE);
    }

    /**
     * Retrieve Marker Icon
     *
     * @return string
     */
    public function getMarkerIcon()
    {
		return $this->_getConfig(self::XML_CONTACTMAP_MARKER);
    }
    
    /**
     * Retrieve Map Zoom
     *
     * @return string
     */
    public function getZoom()
    {
		return $this->_getConfig(self::XML_CONTACTMAP_ZOOM);
    }
    
    /**
     * Retrieve Map Api Key
     *
     * @return null|string
     */
    public function getApiKey()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_API_KEY);
    }
            
    /**
     * Retrieve Marker Position
     *
     * @return array
     */
    public function getMarkerPosition()
    {
		$config = [
			'lat' => $this->_getConfig(self::XML_CONTACTMAP_LATITUDE),
			'lng' => $this->_getConfig(self::XML_CONTACTMAP_LONGITUDE)
		];

        return $config;
    }
    
    /**
     * Retrieve Store Configuration Data
     *
     * @param   string $path
     * @return  string|null
     */
    protected function _getConfig($path)
    {
        // replace any placeholders with the map type
        // this allows us to use methods like `getAPI` regardless of the selected map type
        if($path !== self::XML_CONTACTMAP_TYPE){
            $path = sprintf($path, $this->getMapType());
        }

        return $this->scopeConfig->getValue($path, ScopeInterface::SCOPE_STORE);
    }
}
