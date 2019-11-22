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
        init: function() {
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
    };

    $(document).ready(function() {
        RecordListTabs.init();
    });

    return RecordListTabs;
});
