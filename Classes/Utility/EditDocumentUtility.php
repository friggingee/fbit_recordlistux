<?php

namespace FBIT\RecordlistUx\Utility;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class EditDocumentUtility
{
    public function getRecordCopyUid(ServerRequestInterface $request, ResponseInterface $response)
    {
        $requestParams = $request->getQueryParams();
        $tablename = $requestParams['tablename'];
        $uid = $requestParams['uid'];

        $currentRecord = BackendUtility::getRecord($tablename, $uid);
        $availableRecords = BackendUtility::getRecordsByField(
            $tablename,
            'pid',
            $currentRecord['pid'],
            '',
            '',
            ($GLOBALS['TCA'][$tablename]['ctrl']['sortby'] ? $GLOBALS['TCA'][$tablename]['ctrl']['sortby'] . ' ASC' : '')
        );
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