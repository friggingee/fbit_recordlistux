<?php

namespace FBIT\RecordlistUx\Hooks\Backend\Template\Components\ButtonBar;

use TYPO3\CMS\Backend\Template\Components\ButtonBar;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\HiddenRestriction;
use TYPO3\CMS\Core\FormProtection\FormProtectionFactory;
use TYPO3\CMS\Core\Imaging\Icon;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\Query;

class GetButtonsHook
{
    /** @var array $editSettings */
    protected $editSettings = array();

    /** @var string $tablename */
    protected $tablename = '';

    /** @var int $uid */
    protected $uid = 0;

    /** @var array $previousRecord */
    protected $previousRecord = array();

    /** @var array $nextRecord */
    protected $nextRecord = array();

    /** @var IconFactory $iconFactory */
    protected $iconFactory = null;

    /**
     * @param array $params
     * @param ButtonBar $buttonBar
     * @return array $buttons
     */
    public function getButtons(array $params, ButtonBar $buttonBar)
    {
        $buttons = $params['buttons'];
        $this->iconFactory = GeneralUtility::makeInstance(IconFactory::class);

        $this->genereateEditFormButtons($buttonBar, $buttons);

        return $buttons;
    }

    /**
     * @param ButtonBar $buttonBar
     * @param $buttons
     */
    public function genereateEditFormButtons(ButtonBar $buttonBar, &$buttons)
    {
        if (GeneralUtility::_GET('route') === '/record/edit') {
            $this->editSettings = GeneralUtility::_GET('edit');
            $this->tablename = array_keys($this->editSettings)[0];
            $this->uid = array_keys(reset($this->editSettings))[0];
            $this->previousRecord = $previousRecord = null;
            $this->nextRecord = $nextRecord = null;

            $this->determinePrevAndNextRecord();
            $this->generatePrevAndNextRecordButtons($buttonBar, $buttons);
            if ($this->tablename !== 'pages') {
                $this->generateCopyRecordButton($buttonBar, $buttons);
            }
            $this->generateRecordListButton($buttonBar, $buttons);
        }
    }

    /**
     *
     */
    protected function determinePrevAndNextRecord()
    {
        $currentRecord = BackendUtility::getRecord($this->tablename, $this->uid);

        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable($this->tablename);
        $queryBuilder->getRestrictions()->removeByType(HiddenRestriction::class);
        $queryBuilder->select('*')
            ->from($this->tablename)
            ->where(
                $queryBuilder->expr()->eq('pid', (int)$currentRecord['pid'])
            );

        if ($GLOBALS['TCA'][$this->tablename]['ctrl']['languageField']) {
            $queryBuilder->andWhere(
                $queryBuilder->expr()->eq($GLOBALS['TCA'][$this->tablename]['ctrl']['languageField'], 0)
            );
        }
        if ($GLOBALS['TCA'][$this->tablename]['ctrl']['sortby']) {
            $queryBuilder->orderBy($GLOBALS['TCA'][$this->tablename]['ctrl']['sortby'], Query::ORDER_ASCENDING);
        }

        $availableRecords = $queryBuilder->execute()->fetchAll();

        foreach ($availableRecords as $index => $availableRecord) {
            if ($availableRecord['uid'] === $this->uid) {
                if ($availableRecords[$index - 1]) {
                    $this->previousRecord = $availableRecords[$index - 1];
                }
                if ($availableRecords[$index + 1]) {
                    $this->nextRecord = $availableRecords[$index + 1];
                }
                break;
            }
        }
    }

    /**
     * @param ButtonBar $buttonBar
     * @param $buttons
     */
    protected function generatePrevAndNextRecordButtons(ButtonBar $buttonBar, &$buttons)
    {
        $prevRecordButtonUrl = '#';

        if (!empty($this->previousRecord)) {
            $prevRecordButtonUrl = BackendUtility::getModuleUrl('record_edit', [
                'edit' => [
                    $this->tablename => [
                        $this->previousRecord['uid'] => 'edit'
                    ]
                ],
                'returnUrl' => GeneralUtility::_GET('returnUrl')
            ]);
        }

        $prevRecordButtonTitle = 'Show previous record';
        $prevRecordButtonIcon = $this->iconFactory->getIcon(
            (!empty($this->previousRecord) ? 'actions-view-paging-previous' : 'actions-view-paging-previous-disabled'),
            Icon::SIZE_SMALL
        );

        $prevRecordButton = $buttonBar->makeLinkButton()
            ->setHref($prevRecordButtonUrl)
            ->setDataAttributes([
                'toggle' => 'tooltip',
                'placement' => 'bottom',
                'title' => $prevRecordButtonTitle
            ])
            ->setTitle($prevRecordButtonTitle)
            ->setIcon($prevRecordButtonIcon)
            ->setClasses('fbitrecordlistux-record-prev');

        if (empty($this->previousRecord)) {
            $prevRecordButton->setClasses('disabled');
        }

        $buttons[ButtonBar::BUTTON_POSITION_RIGHT][120][] = $prevRecordButton;

        $nextRecordButtonUrl = '#';

        if (!empty($this->nextRecord)) {
            $nextRecordButtonUrl = BackendUtility::getModuleUrl('record_edit', [
                'edit' => [
                    $this->tablename => [
                        $this->nextRecord['uid'] => 'edit'
                    ]
                ],
                'returnUrl' => GeneralUtility::_GET('returnUrl')
            ]);
        }

        $nextRecordButtonTitle = 'Show next record';
        $nextRecordButtonIcon = $this->iconFactory->getIcon(
            (!empty($this->nextRecord) ? 'actions-view-paging-next' : 'actions-view-paging-next-disabled'),
            Icon::SIZE_SMALL
        );

        $nextRecordButton = $buttonBar->makeLinkButton()
            ->setHref($nextRecordButtonUrl)
            ->setDataAttributes([
                'toggle' => 'tooltip',
                'placement' => 'bottom',
                'title' => $nextRecordButtonTitle
            ])
            ->setTitle($nextRecordButtonTitle)
            ->setIcon($nextRecordButtonIcon)
            ->setClasses('fbitrecordlistux-record-next');

        if (empty($this->nextRecord)) {
            $nextRecordButton->setClasses('disabled');
        }

        $buttons[ButtonBar::BUTTON_POSITION_RIGHT][120][] = $nextRecordButton;
    }

    /**
     * @param ButtonBar $buttonBar
     * @param $buttons
     */
    protected function generateRecordListButton(ButtonBar $buttonBar, &$buttons)
    {
        $recordListButtonTitle = 'Show current table records';
        $recordListButtonIcon = $this->iconFactory->getIcon(
            'actions-system-list-open',
            Icon::SIZE_SMALL
        );

        $recordListButton = $buttonBar->makeLinkButton()
            ->setHref('#')
            ->setDataAttributes([
                'toggle' => 'tooltip',
                'placement' => 'bottom',
                'title' => $recordListButtonTitle
            ])
            ->setTitle($recordListButtonTitle)
            ->setIcon($recordListButtonIcon)
            ->setClasses('fbitrecordlistux-showtablerecords');

        $buttons[ButtonBar::BUTTON_POSITION_RIGHT][121][] = $recordListButton;
    }

    protected function generateCopyRecordButton(ButtonBar $buttonBar, &$buttons) {
        $recordCopyButtonTitle = 'Create copy';
        $recordCopyButtonIcon = $this->iconFactory->getIcon(
            'actions-edit-copy',
            Icon::SIZE_SMALL
        );

        $recordCopyButton = $buttonBar->makeLinkButton()
            ->setHref('#')
            ->setDataAttributes([
                'toggle' => 'tooltip',
                'placement' => 'bottom',
                'title' => $recordCopyButtonTitle
            ])
            ->setTitle($recordCopyButtonTitle)
            ->setIcon($recordCopyButtonIcon)
            ->setClasses('fbitrecordlistux-copyrecord');

        $buttons[ButtonBar::BUTTON_POSITION_LEFT][120][] = $recordCopyButton;
    }
}
