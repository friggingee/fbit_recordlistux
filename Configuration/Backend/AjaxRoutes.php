<?php
return [
    'get_ux_table_records' => [
        'path' => '/fbit_recordlistux/gettablerecords',
        'target' => \FBIT\RecordlistUx\Utility\TableRecordsUtility::class . '::getTableRecords',
    ]
];