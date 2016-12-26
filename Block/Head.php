<?php
/**
 * Faonni
 *  
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade module to newer
 * versions in the future.
 * 
 * @package     Faonni_ContactMap
 * @copyright   Copyright (c) 2016 Karliuka Vitalii(karliuka.vitalii@gmail.com) 
 * @license     http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
namespace Faonni\ContactMap\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Framework\Locale\ResolverInterface;
use Faonni\ContactMap\Helper\Data as ContactMapHelper;

/**
 * ContactMap Block Head
 */
class Head extends Template
{
    /**
     * Helper instance
     *
     * @var \Faonni\ContactMap\Helper\Data
     */
    protected $_helper; 
    
    /**
     * Resolver instance 
     * 
     * @var Magento\Framework\Locale\ResolverInterface
     */
    protected $_resolver;    
    
    /**
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Faonni\ContactMap\Helper\Data $helper
     * @param \Magento\Framework\Locale\ResolverInterface $resolver
     * @param array $data
     * 
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
		Context $context, 
		ContactMapHelper $helper,
		ResolverInterface $resolver,
		array $data = []
	) {
        $this->_helper = $helper;
        $this->_resolver = $resolver;
        parent::__construct($context, $data);
    }

    /**
     * Retrieve map api key
     *
     * @return string
     */
    public function getApiKey()
    {
		return $this->_helper->getApiKey();
    } 
	
    /**
     * Return locale code
     *
     * @return string
     */
    public function getLocale()
    {
        return $this->_resolver->getLocale();
    }    
}
