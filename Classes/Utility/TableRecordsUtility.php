<?php

namespace FBIT\RecordlistUx\Utility;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class TableRecordsUtility {
    public function getTableRecords(ServerRequestInterface $request, ResponseInterface $response)
    {
        $requestParams = $request->getQueryParams();
        $tablename = $requestParams['tablename'];
        $pid = $requestParams['pid'];

        $records = BackendUtility::getRecordsByField($tablename, 'pid', $pid);

        $response->getBody()->write(json_encode($records));

        return $response;
    }
}