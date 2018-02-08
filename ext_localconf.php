<?php
defined('TYPO3_MODE') || die('Access denied.');

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['recordlist/Modules/Recordlist/index.php']['drawFooterHook'][] = \FBIT\RecordlistUx\Hooks\RecordListDrawFooterHook::class . '->adjustWebListModule';
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['Backend\Template\Components\ButtonBar']['getButtonsHook'][] = \FBIT\RecordlistUx\Hooks\ButtonBarGetButtonsHook::class . '->getButtons';

/** @var \TYPO3\CMS\Extbase\SignalSlot\Dispatcher $signalSlotDispatcher */
$signalSlotDispatcher = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\SignalSlot\Dispatcher::class);
$signalSlotDispatcher->connect(
    // Signal class name
    \TYPO3\CMS\Backend\Controller\EditDocumentController::class,
    // Signal name
    'initAfter',
    // Slot class name
    \FBIT\RecordlistUx\Signals\EditDocumentControllerInitSlot::class,
    // Slot name
    'adjustEditDocumentController'
);