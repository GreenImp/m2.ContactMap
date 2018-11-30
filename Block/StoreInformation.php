<?php
namespace Faonni\ContactMap\Block;

/**
 * StoreInformation Block
 */
class StoreInformation extends \Magento\Framework\View\Element\Template
{
    protected $_renderer;
    protected $_storeManager;
    protected $_storeInfo;

    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Store\Model\Information $storeInfo,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Store\Model\Address\Renderer $renderer,
        array $data = []
    )
    {
        parent::__construct($context, $data);

        $this->_renderer = $renderer;
        $this->_storeInfo = $storeInfo;
        $this->_storeManager = $storeManager;
    }

    /**
     * Returns the store interface
     *
     * @return \Magento\Store\Api\Data\StoreInterface
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    protected function getStore(){
        return $this->_storeManager->getStore();
    }

    /**
     * Returns the store address un-formatted (With `\n` linebreaks between each line)
     *
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException]
     */
    public function getAddress(){
        return $this->_renderer->format($this->_storeInfo->getStoreInformationObject($this->getStore()), 'plain');
    }

    /**
     * Returns the store address un-formatted, without line breaks (`\n` or `<br>`)
     * 
     * @return mixed
     */
    public function getAddressInline(){
        return str_replace(array("\n\r", "\n", "\r"), ',', $this->getAddress());
    }

    /**
     * Returns the store address formatted as html
     *
     * @return string
     * @throws \Magento\Framework\Exception\NoSuchEntityException
     */
    public function getFormattedAddress(){
        return $this->_storeInfo->getFormattedAddress($this->getStore());
    }

    /**
     * Returns the block title
     *
     * @return \Magento\Framework\Phrase
     */
    public function getTitle()
    {
        return __('Store Information');
    }

    /**
     * Allows passing through any method calls for getting store properties, without
     * having to define getters for each one.
     *
     * ie.
     * `$this->getPhone()`
     * will call the `getPhone()` method on the store and return the phone number
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
            $store = $this->_storeInfo->getStoreInformationObject($this->getStore());

            return $store->$method();
        }

        return parent::__call($method, $args);
    }
}
