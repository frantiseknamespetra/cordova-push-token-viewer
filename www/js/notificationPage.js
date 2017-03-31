/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var notificationPage = {

	initialize: function() {
        notificationPage.bindEvents();
    },

    loadNotifications: function() {
    	app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM notifications", [], 
                           function (transaction, resultSet) { 
                                var $list = $('#notification-list');

                                if (resultSet.rows.length == 0) {
                                    $list.text("Not found notifications.");
                                    return;
                                }    
                                $list.empty();    
                                for (var i = 0; i < resultSet.rows.length; i++) {
                                    var data = resultSet.rows.item(i);
                                    
                                    var pn = '<li class="table-view-cell media">' +
                                                <!-- TODO add image -->
                                                //'<img class="media-object pull-left" src="http://placehold.it/42x42">' +
                                                '<div class="media-body">' +
                                                    data.title + 
                                                    '<p>' + data.message + '</p>' +
                                                '</div>' +
                                            '</li>';    
                                    $(pn).appendTo($list)
                                }    

                            },
                            function (transaction, error) { console.log('Error: ' + error.message) }
                         )

        });
    },

    deleteAllNotifications: function() {
    	app.db.transaction(function (tx) {
            tx.executeSql("DELETE FROM notifications", 
            			  [], 
            			  function (transaction, resultSet) { $('#notification-list').text("Not found notifications."); },
            			  function (transaction, error) { console.log('Error: ' + error.message) });
        });
    },

    refreshPage: function() {
    	notificationPage.loadNotifications();
    },

    bindEvents: function() {
    	window.addEventListener('push', function(e) {
            if (e.detail.state.url.indexOf('notification.html') > 0) {
            	notificationPage.loadNotifications();

            	$('#deleteAllBtn').on('click', $.proxy(notificationPage.deleteAllNotifications, notificationPage));
    			$('#refreshBtn').on('click', $.proxy(notificationPage.refreshPage, notificationPage));
            }
        });    	
    }
}