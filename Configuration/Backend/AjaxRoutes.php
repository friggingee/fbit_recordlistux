<?php
return [
    'get_ux_table_records' => [
        'path' => '/fbit_recordlistux/gettablerecords',
        'target' => \FBIT\RecordlistUx\Utility\TableRecordsUtility::class . '::getTableRecords',
    ],
    'get_record_copy_uid' => [
        'path' => '/fbit_recordlistux/gerrecordcopyuid',
        'target' => \FBIT\RecordlistUx\Utility\EditDocumentUtility::class . '::getRecordCopyUid',
    ]
];