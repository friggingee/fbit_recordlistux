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
                $(item).before($('<a>', {'id': $(item).find('a[data-target]').data('target').substring(1, $(item).find('a[data-target]').data('target').length), 'style': 'top:-120px;position:relative;display:block;'}));
            });
            var $tabs = [];
            $('.recordlist .panel-heading').each(function(index, item) {
                $tabs.push($(item).clone());
            });
            $('.module-body h1').attr('style', 'clear:both;margin-top:35px;').before($('<div>', {class: 'recordlist-tabs', style: 'position:fixed;top:65px;z-index:20;width:100%;margin-left:-24px;padding:0 42px 0 24px;'}));
            $('.recordlist-tabs').append($tabs);
            $('.recordlist-tabs .panel-heading').each(function(index, item) {
                $(item).find('a:first').attr('href', $(item).find('a[data-target]').data('target'));
                $(item).attr('title', $(item).find('a:first').text());
            });
            var recordTypeCount = $('.recordlist .panel-heading').length;
            $('.recordlist-tabs .panel-heading').attr('style', 'float:left;background:aliceblue;border-right:1px solid lightgrey;border-bottom:1px solid lightgrey;width:calc(100% / ' + recordTypeCount + ');height:40px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;').find('.t3js-toggle-recordlist').remove();
            $('.recordlist-tabs .panel-heading:first').attr('style', $('.recordlist-tabs .panel-heading:first').attr('style') + 'border-left:1px solid lightgrey;');
        }
    };

    $(document).ready(function() {
        RecordListTabs.init();
    });

    return RecordListTabs;
});
