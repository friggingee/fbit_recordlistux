<?php
defined('TYPO3_MODE') || die('Access denied.');

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['recordlist/Modules/Recordlist/index.php']['drawFooterHook'][] = \FBIT\RecordlistUx\Hooks\RecordListDrawFooterHook::class . '->adjustWebListModule';
$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['Backend\Template\Components\ButtonBar']['getButtonsHook'][] = \FBIT\RecordlistUx\Hooks\ButtonBarGetButtonsHook::class . '->getButtons';