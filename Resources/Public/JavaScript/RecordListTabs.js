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
 * Module: TYPO3/CMS/FbitRecordlistux/RecordListTabs
 */
define(['jquery'], function ($) {
    'use strict';

    /**
     *
     * @type {{}}
     * @exports TYPO3/CMS/FbitRecordlistux/RecordListTabs
     */
    var RecordListTabs = {
        languages: {},

        init: function() {
            this.drawContentTypeJumpLinkNavigation();
            this.addTranslationDeletionButtons();
        },

        drawContentTypeJumpLinkNavigation: function() {
            if ($('.recordlist .panel-heading a[data-target]').length > 0) {
                $('.recordlist .panel-heading').each(function(index, item) {
                    $(item).before(
                        $(
                            '<a>',
                            {
                                'class': 'recordlisttab-target',
                                'id': $(item).find('a[data-target]').data('target').substring(1, $(item).find('a[data-target]').data('target').length)
                            }
                        )
                    );
                });
                var $tabs = [];
                $('.recordlist .panel-heading').each(function(index, item) {
                    $tabs.push($(item).clone());
                });
                $('.module-docheader').addClass('recordlisttabs-active');
                $('.module-docheader .module-docheader-bar-navigation').before($('<div>', {class: 'recordlist-tabs'}));
                $('.recordlist-tabs').append($tabs);
                $('.recordlist-tabs .panel-heading').each(function(index, item) {
                    $(item).find('a:first').attr('href', $(item).find('a[data-target]').data('target'));
                    $(item).find('[data-identifier=actions-view-table-expand]').parent().remove();
                    $(item).attr('title', $(item).find('a:first').text());
                });
                var recordTypeCount = $('.recordlist .panel-heading').length;
                $('.recordlist-tabs .panel-heading').attr('style', 'width: calc(100% / ' + recordTypeCount + ');').find('.t3js-toggle-recordlist').remove();
            }
        },

        addTranslationDeletionButtons: function() {
            if ($('th.col-clipboard .btn-group > *').length > 0) {
                var languageIcons = {};
                $('th.col-clipboard').parents('table').each(function(index, item) {
                    languageIcons[$(item).data('table')] = {};
                });
                $('th.col-clipboard').parents('table').find('.col-localizationa .icon').each(function(index, item) {
                    if (parseInt($(item).parents('[data-uid]').data('l10nparent')) > 0) {
                        $(item).parents('[data-uid]').addClass('del-l10n-pick-me');
                        languageIcons[$(item).parents('table').data('table')][$(item).data('identifier')] = [];
                    }
                })
                $('.del-l10n-pick-me').find('.col-localizationa .icon').each(function(index, item) {
                    languageIcons[$(item).parents('table').data('table')][$(item).data('identifier')].push($(item).parents('[data-uid]').data('uid'));
                })

                for (var tablename in languageIcons) {
                    for (var languageIdentifier in languageIcons[tablename]) {
                        var CBstringsArray = [];
                        $(languageIcons[tablename][languageIdentifier]).each(function(index, recordUid) {
                            CBstringsArray.push(tablename + '|' + recordUid);
                        })

                        var CBstring = CBstringsArray.join(',');

                        $('table[data-table=' + tablename + '] th.col-clipboard .icon-actions-document-select').parents('a').after(
                            $('<a>', {class: 'btn btn-default', rel: '', href: '#', onclick: 'checkOffCB(\'' + CBstring + '\', this); return false;', title: '', 'data-original-title': 'Mark All/Mark none in this language'}).append(
                                $('table[data-table=' + tablename + '] .col-localizationa [data-identifier=' + languageIdentifier + ']').parents('span[title]')[0].outerHTML
                            )
                        )
                    }
                }
            }
        },
    };

    $(document).ready(function() {
        RecordListTabs.init();

        window.RecordListTabs = RecordListTabs;
    });

    return RecordListTabs;
});
