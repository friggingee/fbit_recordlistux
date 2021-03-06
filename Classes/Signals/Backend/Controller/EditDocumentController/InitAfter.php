<?php

namespace FBIT\RecordlistUx\Signals\Backend\Controller\EditDocumentController;

use TYPO3\CMS\Backend\Controller\EditDocumentController;

class InitAfter {
    public function adjustEditDocumentController(EditDocumentController $editDocumentController)
    {
        $pageRenderer = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(
            \TYPO3\CMS\Core\Page\PageRenderer::class
        );
        $pageRenderer->loadRequireJsModule('TYPO3/CMS/FbitRecordlistux/EditDocumentRecordList');
        $pageRenderer->addCssFile(
            'EXT:fbit_recordlistux/Resources/Public/Stylesheets/Styles.css',
            'stylesheet', 'all', '', true, true, '', false, ''
        );
    }
}
