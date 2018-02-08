/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * Module: TYPO3/CMS/FbitRecordlistux/EditDocumentRecordList
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     *
     * @type {{}}
     * @exports TYPO3/CMS/FbitRecordlistux/EditDocumentRecordList
     */
    var EditDocumentRecordList = {
        init: function() {
            $('a.fbitrecordlistux-showtablerecords').on('click', function(e) {
                if ($('.fbitrecordlistux-tablerecords').length === 0) {
                    $('.module').append(
                        '<div class="fbitrecordlistux-tablerecords">' +
                        '   <div class="header">' +
                        '       <div class="tablename"></div>' +
                        '   </div>' +
                        '   <div class="list">' +
                        '       <table class="table table-striped table-hover"></table>' +
                        '   </div>' +
                        '</div>'
                    );

                    var tablename = $('[data-table]:last').data('table');
                    var pid = $('[data-table]:first').data('uid');

                    $.ajax(
                        {
                            url: TYPO3.settings.ajaxUrls['get_ux_table_records'],
                            method: 'GET',
                            data: {'tablename': tablename, 'pid': pid},
                            error: function(xhr, status, error) {
                            },
                            success: function(data, status, xhr) {
                                $('.fbitrecordlistux-tablerecords .header .tablename').html('<strong>' + tablename + '</strong>');

                                var records = data;

                                $('.fbitrecordlistux-tablerecords .list table').append(
                                    '<thead><tr><th>uid</th><th>title</th></tr></thead><tbody></tbody>'
                                );

                                for (var record in records) {
                                    $('.fbitrecordlistux-tablerecords .list table tbody').append(
                                        '<tr><td>[' + records[record].uid + ']</td><td>' + records[record].header + '</td></tr>'
                                    );
                                }

                                $('.fbitrecordlistux-tablerecords table th:first').css(
                                    'width',
                                    $('.fbitrecordlistux-tablerecords table td:first').css('width')
                                );
                                $('.fbitrecordlistux-tablerecords table th:last').css(
                                    'width',
                                    ($('.fbitrecordlistux-tablerecords table').css('width')
                                    - $('.fbitrecordlistux-tablerecords table th:first').css('width')) + 'px'
                                );
                            }
                        }
                    );
                } else {
                    var $tableRecords = $('.fbitrecordlistux-tablerecords');

                    if ($tableRecords.is(':visible')) {
                        $tableRecords.hide();
                    } else {
                        $tableRecords.show();
                    }
                }
            });
        }
    };

    $(document).ready(function() {
        EditDocumentRecordList.init();
    });

    return EditDocumentRecordList;
});