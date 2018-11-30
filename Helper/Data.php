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
     * Map Controls Config Path
     */
    const XML_CONTACTMAP_CONTROLS_CONFIG = 'contact_map/map_controls';

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
    const XML_CONTACTMAP_API_KEY = 'api_key';

    /**
     * Marker Config Path
     */
    const XML_CONTACTMAP_MARKER = 'contact_map/marker';

    /**
     * Map Type Config Path
     */
    const XML_CONTACTMAP_TYPE = 'contact_map/map/map_type';

    /**
     * Map Type Configs Config Path
     */
    const XML_CONTACTMAP_TYPE_CONFIG = 'contact_map/map_type_%s';

    /**
     * Popup Config Path
     */
    const XML_CONTACTMAP_POPUP_CONFIG = 'contact_map/popup';

    /**
     * Popup Enabled Config Path
     */
    const XML_CONTACTMAP_POPUP_ENABLED = 'contact_map/popup/enabled';

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
     * Check if the map popup is enabled
     *
     * @return bool
     */
    public function isPopupEnabled()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_POPUP_ENABLED);
    }

    /**
     * Returns the config for map controls
     *
     * @return array
     */
    public function getMapControlsConfig()
    {
        $config = $this->_getConfig(self::XML_CONTACTMAP_CONTROLS_CONFIG) ?? [];

        // force required boolean values to be boolean
        $config = $this->parseValuesAsBool($config, ['scaleControl', 'zoomControl']);

        return $config;
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
     * Returns all of the config values for the given map type
     *
     * @return array
     */
    public function getMapTypeConfig()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_TYPE_CONFIG);
    }

    /**
     * Returns all of the marker related data
     *
     * @return array
     */
    public function getMarkerData()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_MARKER);
    }

    /**
     * Retrieve Marker Icon
     *
     * @return string
     */
    public function getMarkerIcon()
    {
        return $this->getMarkerData()['icon'];
    }

    /**
     * Retrieve Map Zoom
     *
     * @return int
     */
    public function getZoom()
    {
        return intval($this->_getConfig(self::XML_CONTACTMAP_ZOOM));
    }

    /**
     * Retrieve Map Api Key
     *
     * @return null|string
     */
    public function getApiKey()
    {
        return $this->_getConfig(self::XML_CONTACTMAP_TYPE_CONFIG . '/' . self::XML_CONTACTMAP_API_KEY);
    }

    /**
     * Retrieve Marker Position
     *
     * @return array
     */
    public function getMarkerPosition()
    {
        return [
            'lat' => $this->_getConfig(self::XML_CONTACTMAP_LATITUDE),
            'lng' => $this->_getConfig(self::XML_CONTACTMAP_LONGITUDE)
        ];
    }

    /**
     * Returns all of the config values for the popup
     *
     * @return array
     */
    public function getPopupConfig()
    {
        $config = $this->_getConfig(self::XML_CONTACTMAP_POPUP_CONFIG);

        // add the marker position as the popup position
        $config['position'] = $this->getMarkerPosition();

        // force required boolean values to be boolean
        $config = $this->parseValuesAsBool(
            $config,
            [
                'enabled',
                'always_show',
                'show_address',
                'show_directions_link',
            ]
        );

        return $config;
    }

    /**
     * Retrieve Store Configuration Data
     *
     * @param   string $path
     * @return mixed
     */
    protected function _getConfig($path)
    {
        // replace any placeholders with the map type
        // this allows us to use methods like `getAPI` regardless of the selected map type
        if ($path !== self::XML_CONTACTMAP_TYPE) {
            $path = sprintf($path, $this->getMapType());
        }

        return $this->scopeConfig->getValue($path, ScopeInterface::SCOPE_STORE);
    }

    /**
     * Parse the given value(s) as a boolean.
     * If `$value` is an array, each element will be parsed.
     * If `$whitelist` is also defined, only values with keys that exist in the whitelist will be parsed
     *
     * @param array|string $value
     * @param array|null $whitelist
     * @return array|bool
     */
    protected function parseValuesAsBool($value, array $whitelist = null)
    {
        if (is_array($value)) {
            $keys = is_array($whitelist) && !empty($whitelist) ? array_intersect(array_keys($value), $whitelist) : array_keys($value);

            foreach ($keys as $key) {
                $value[$key] = $this->parseValuesAsBool($value[$key]);
            }

            return $value;
        } else {
            return boolval($value);
        }
    }
}
