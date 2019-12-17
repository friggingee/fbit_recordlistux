<?php

namespace FBIT\RecordlistUx\Utility;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\Restriction\HiddenRestriction;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\Query;

class EditDocumentUtility
{
    public function getRecordCopyUid(ServerRequestInterface $request, ResponseInterface $response)
    {
        $requestParams = $request->getQueryParams();
        $tablename = $requestParams['tablename'];
        $uid = $requestParams['uid'];

        $currentRecord = BackendUtility::getRecord($tablename, $uid);

        $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable($tablename);
        $queryBuilder->getRestrictions()->removeByType(HiddenRestriction::class);
        $queryBuilder->select('*')
            ->from($tablename)
            ->where(
                $queryBuilder->expr()->eq('pid', $currentRecord['pid'])
            );

        if ($GLOBALS['TCA'][$this->tablename]['ctrl']['languageField']) {
            $queryBuilder->andWhere(
                $queryBuilder->expr()->eq($GLOBALS['TCA'][$this->tablename]['ctrl']['languageField'], 0)
            );
        }

        if ($GLOBALS['TCA'][$tablename]['ctrl']['sortby']) {
            $queryBuilder->orderBy($GLOBALS['TCA'][$tablename]['ctrl']['sortby'], Query::ORDER_ASCENDING);
        }

        $availableRecords = $queryBuilder->execute()->fetchAll();
        $nextRecord = [];

        foreach ($availableRecords as $index => $availableRecord) {
            if ($availableRecord['uid'] === intval($uid)) {
                if ($availableRecords[$index + 1]) {
                    $nextRecord = $availableRecords[$index + 1];
                }
                break;
            }
        }

        $copyRecordEditUrl = BackendUtility::getModuleUrl('record_edit', [
            'edit' => [
                $tablename => [
                    $nextRecord['uid'] => 'edit'
                ]
            ],
            'returnUrl' => GeneralUtility::_GET('returnUrl')
        ]);

        $response->getBody()->write(json_encode($copyRecordEditUrl));

        return $response;
    }
}
