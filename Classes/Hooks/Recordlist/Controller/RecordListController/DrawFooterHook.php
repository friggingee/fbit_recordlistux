<?php
namespace FBIT\RecordlistUx\Hooks\Recordlist\Controller\RecordListController;

use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Recordlist\RecordList;

class DrawFooterHook
{
    /**
     * @var null|RecordList $recordList
     */
    protected $recordList = null;

    /**
     * @var null|PageRenderer
     */
    protected $pageRenderer = null;

    /**
     * @param array $params
     * @param RecordList $recordList
     * @return string
     * @throws \Exception
     */
    public function adjustWebListModule(array $params, RecordList &$recordList)
    {
        $this->pageRenderer = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
            \TYPO3\CMS\Core\Page\PageRenderer::class
        );
        $this->pageRenderer->loadRequireJsModule('TYPO3/CMS/FbitRecordlistux/RecordListTabs');
        $this->pageRenderer->addCssFile(
            'EXT:fbit_recordlistux/Resources/Public/Stylesheets/Styles.css',
            'stylesheet', 'all', '', true, true, '', false, ''
        );

        return '';
    }
}
