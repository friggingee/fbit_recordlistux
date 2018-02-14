<?php

namespace FBIT\RecordlistUx\Utility;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Database\ConnectionPool;
use TYPO3\CMS\Core\Database\Query\QueryBuilder;
use TYPO3\CMS\Core\Database\Query\Restriction\QueryRestrictionInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Extbase\Utility\LocalizationUtility;
use TYPO3\CMS\Lang\LanguageService;

class TableRecordsUtility
{
    public function getTableRecords(ServerRequestInterface $request, ResponseInterface $response)
    {
        $requestParams = $request->getQueryParams();
        $tablename = $requestParams['tablename'];
        $uid = $requestParams['uid'];
        $pid = $requestParams['pid'];

        /** @var ObjectManager $objectManager */
        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        /** @var LanguageService $languageService */
        $languageService = $objectManager->get(LanguageService::class);

        $data = [];

        $currentRecord = null;
        if (intval($uid) > 0) {
            $currentRecord = BackendUtility::getRecord($tablename, $uid);
            $pid = $currentRecord['pid'];
        }

        $records = BackendUtility::getRecordsByField(
            $tablename,
            'pid',
            $pid,
            BackendUtility::deleteClause($tablename),
            '',
            ($GLOBALS['TCA'][$tablename]['ctrl']['sortField'] ? $GLOBALS['TCA'][$tablename]['ctrl']['sortField'] . ' ASC' : '')
        );

        foreach ($records as $index => $record) {
            $records[$index]['editlink'] = BackendUtility::getModuleUrl(
                'record_edit',
                [
                    'edit' => [
                        $tablename => [
                            $record['uid'] => 'edit',
                        ],
                    ],
                    'returnUrl' => GeneralUtility::_GET('returnUrl'),
                ]
            );
        }

        $recordTypeOptions = [];

        foreach ($GLOBALS['TCA'] as $table => $config) {
            /** @var QueryBuilder $queryBuilder */
            $queryBuilder = GeneralUtility::makeInstance(ConnectionPool::class)->getQueryBuilderForTable($tablename);

            $count = $queryBuilder
                ->count('*')
                ->from($table)
                ->where($queryBuilder->expr()->eq($table . '.pid', $queryBuilder->createNamedParameter($pid)))
                ->execute()
                ->fetchColumn(0);
            if ($count > 0) {
                $recordTypeOptions[$table] = $languageService->sL($GLOBALS['TCA'][$table]['ctrl']['title']);
            }
        }

        $data['recordType'] = $languageService->sL($GLOBALS['TCA'][$tablename]['ctrl']['title']);
        $data['recordTypeOptions'] = $recordTypeOptions;
        $data['titleField'] = $GLOBALS['TCA'][$tablename]['ctrl']['label'];
        $data['records'] = $records;

        $response->getBody()->write(json_encode($data));

        return $response;
    }
}