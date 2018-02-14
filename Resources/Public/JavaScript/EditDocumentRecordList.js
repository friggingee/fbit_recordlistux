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
define([
    'jquery',
    'TYPO3/CMS/Backend/Modal',
    'TYPO3/CMS/Backend/Severity'
], function ($, Modal, Severity) {
    'use strict';

    /**
     *
     * @type {{}}
     * @exports TYPO3/CMS/FbitRecordlistux/EditDocumentRecordList
     */
    var EditDocumentRecordList = {
        tablename: '',
        uid: '',
        pid: '',
        uiBlockTemplate: '   <div id="t3js-ui-block" class="ui-block">' +
        '       <span class="t3js-icon icon icon-size-large icon-state-default icon-spinner-circle-light icon-spin" data-identifier="spinner-circle-light">' +
        '           <span class="icon-markup">' +
        '               <img src="/typo3/sysext/core/Resources/Public/Icons/T3Icons/spinner/spinner-circle-light.svg" width="48" height="48">' +
        '           </span>' +
        '       </span>' +
        '   </div>',

        enableDataLossPreventionOnPrevNextButtons: function () {
            $('a[class*=fbitrecordlistux-record]').on('click', function (e) {
                e.preventDefault();
                EditDocumentRecordList.preventExitIfNotSaved(e.currentTarget.href);
            });
        },
        enableCopyRecordButton: function () {
            $('a.fbitrecordlistux-copyrecord').on('click', function (e) {
                var $colPosSelect = $('[name="data[' + EditDocumentRecordList.tablename + '][' + EditDocumentRecordList.uid + '][colPos]"]');
                var $langSelect = $('[name="data[' + EditDocumentRecordList.tablename + '][' + EditDocumentRecordList.uid + '][sys_language_uid]"]');

                var colPos = $colPosSelect.length > 0 ? $colPosSelect.val() : 0;
                var language = $langSelect.length > 0 ? $langSelect.val() : 0;

                var url = TYPO3.settings.ajaxUrls['contextmenu_clipboard'];
                url += '&CB[el][' + EditDocumentRecordList.tablename + '%7C' + uid + ']=1' + '&CB[setCopyMode]=1';
                $.ajax({
                    url: url,
                    success: function (data, status, xhr) {
                        var parameters = {};
                        parameters['cmd'] = {};
                        parameters['data'] = {};

                        parameters['cmd'][EditDocumentRecordList.tablename] = {};
                        parameters['data'][EditDocumentRecordList.tablename] = {};

                        parameters['cmd'][EditDocumentRecordList.tablename][EditDocumentRecordList.uid] = {
                            copy: {
                                action: 'paste',
                                target: (parseInt(EditDocumentRecordList.uid) * -1),
                                update: {
                                    colPos: parseInt(colPos),
                                    sys_language_uid: language
                                }
                            }
                        };

                        require(['TYPO3/CMS/Backend/AjaxDataHandler'], function (DataHandler) {
                            DataHandler.process(parameters).done(function (result) {
                                if (!result.hasErrors) {
                                    $.ajax(
                                        {
                                            url: TYPO3.settings.ajaxUrls['get_record_copy_uid'],
                                            method: 'GET',
                                            data: {
                                                'tablename': EditDocumentRecordList.tablename,
                                                'uid': EditDocumentRecordList.uid,
                                                'returnUrl': '/typo3/index.php' + window.location.search
                                            },
                                            error: function (xhr, status, error) {
                                            },
                                            success: function (data, status, xhr) {
                                                window.location = data;
                                            }
                                        }
                                    );
                                }
                            })
                        });
                    }
                });
            });
        },
        drawRecordTable: function (data, records) {
            $('.fbitrecordlistux-tablerecords .list table').append(
                '<thead><tr>' +
                '   <th>' + 'uid'.toUpperCase() + '</th>' +
                '   <th>' + data.titleField.toUpperCase() + '</th>' +
                '</tr></thead>' +
                '<tbody></tbody>'
            );

            for (var record in records) {
                $('.fbitrecordlistux-tablerecords .list table tbody').append(
                    '<tr>' +
                    '   <td><a href="' + records[record].editlink + '">[' + records[record].uid + ']</a></td>' +
                    '   <td><a href="' + records[record].editlink + '">' + records[record][data.titleField] + '</a></td>' +
                    '</tr>'
                );
            }

            $('.fbitrecordlistux-tablerecords table th:first').css(
                'width',
                $('.fbitrecordlistux-tablerecords table td:first').css('width')
            );
            $('.fbitrecordlistux-tablerecords table th:last').css(
                'width',
                parseInt($('.fbitrecordlistux-tablerecords table').css('width'))
                - parseInt($('.fbitrecordlistux-tablerecords table th:first').css('width')) - 2
            );

            $('.fbitrecordlistux-tablerecords .is-loading').removeClass('is-loading');
            $('.fbitrecordlistux-tablerecords .ui-block').remove();
        },

        enableTableRecordsList: function () {
            $('a.fbitrecordlistux-showtablerecords').on('click', function (e) {
                if ($('.fbitrecordlistux-tablerecords').length === 0) {
                    $('.module').append(
                        '<div class="fbitrecordlistux-tablerecords">' + EditDocumentRecordList.uiBlockTemplate +
                        '   <div class="header is-loading">' +
                        '       <div class="tablename"></div>' +
                        '   </div>' +
                        '   <div class="list is-loading">' +
                        '       <table class="table table-striped table-hover"></table>' +
                        '   </div>' +
                        '</div>'
                    );

                    $.ajax(
                        {
                            url: TYPO3.settings.ajaxUrls['get_ux_table_records'],
                            method: 'GET',
                            data: {
                                'tablename': EditDocumentRecordList.tablename,
                                'uid': EditDocumentRecordList.uid
                            },
                            error: function (xhr, status, error) {
                            },
                            success: function (data, status, xhr) {
                                var records = data.records;
                                var $tableOptions = $('<select name="tablename"/>');

                                for (var table in data.recordTypeOptions) {
                                    var label = data.recordTypeOptions[table];
                                    $tableOptions.append($('<option value="' + table + '"' + (table === EditDocumentRecordList.tablename ? 'selected="selected"' : '') + '>' + label + '</option>'));
                                }

                                $('.fbitrecordlistux-tablerecords .header .tablename').append($tableOptions);

                                EditDocumentRecordList.drawRecordTable(data, records);

                                $('.fbitrecordlistux-tablerecords select').on('change', function(e) {
                                    $('.fbitrecordlistux-tablerecords').append(EditDocumentRecordList.uiBlockTemplate);
                                    $('.fbitrecordlistux-tablerecords .header, .fbitrecordlistux-tablerecords .list').addClass('is-loading');
                                    $('.fbitrecordlistux-tablerecords .list table thead, .fbitrecordlistux-tablerecords .list table tbody').remove();

                                    $.ajax(
                                        {
                                            url: TYPO3.settings.ajaxUrls['get_ux_table_records'],
                                            method: 'GET',
                                            data: {
                                                'tablename': e.target.value,
                                                'pid': EditDocumentRecordList.pid
                                            },
                                            error: function (xhr, status, error) {
                                            },
                                            success: function (data, status, xhr) {
                                                var records = data.records;

                                                EditDocumentRecordList.drawRecordTable(data, records);
                                            }
                                        }
                                    );
                                });
                            }
                        }
                    );

                    e.target.blur();
                } else {
                    var $tableRecords = $('.fbitrecordlistux-tablerecords');

                    if ($tableRecords.is(':visible')) {
                        $tableRecords.hide();
                    } else {
                        $tableRecords.show();
                    }
                }
            });
        },
        init: function() {
            var tableData = $('[data-table]:last').data();
            this.tablename = tableData.table;
            this.uid = tableData.uid;
            this.pid = $('[data-table]:first').data('uid');

            this.enableDataLossPreventionOnPrevNextButtons();
            this.enableCopyRecordButton();
            this.enableTableRecordsList();
        },

        preventExitIfNotSaved: function(redirectUrl) {
            if ($('form[name="editform"] .has-change').length > 0) {
                var title = TYPO3.lang['label.confirm.close_without_save.title'] || 'Do you want to quit without saving?';
                var content = TYPO3.lang['label.confirm.close_without_save.content'] || 'You have currently unsaved changes. Are you sure that you want to discard all changes?';
                var $modal = Modal.confirm(title, content, Severity.warning, [
                    {
                        text: TYPO3.lang['buttons.confirm.close_without_save.no'] || 'No, I will continue editing',
                        active: true,
                        btnClass: 'btn-default',
                        name: 'no'
                    },
                    {
                        text: TYPO3.lang['buttons.confirm.close_without_save.yes'] || 'Yes, discard my changes',
                        btnClass: 'btn-warning',
                        name: 'yes'
                    }
                ]);
                $modal.on('button.clicked', function(e) {
                    if (e.target.name === 'no') {
                        Modal.dismiss();
                        return false;
                    } else if (e.target.name === 'yes') {
                        Modal.dismiss();
                        window.location = redirectUrl;
                    }
                });
            } else {
                window.location = redirectUrl;
            }
        }
    };

    $(document).ready(function() {
        EditDocumentRecordList.init();
    });

    return EditDocumentRecordList;
});