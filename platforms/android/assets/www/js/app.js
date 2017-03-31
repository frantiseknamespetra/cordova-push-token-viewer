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
var app = {

	initialize: function() {
        this.db = null;
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        app.initializeWebSql()
        	.done(
        		function(rs) { 
        			console.log('Device ready...');
        			indexPage.initialize();
        			notificationPage.initialize();
        		}
        	)
        	.fail(function(e) {
        		console.log('Intialization failed');
        	});
        
    },

    initializeWebSql: function() {
    	var defer = jQuery.Deferred();

        // Open Databaase
        var dbSize = 5 * 1024 * 1024; // 5MB 
        app.db = openDatabase('notifications', '1.0', 'Notification storage', dbSize, function() {
            console.log('db successfully opened or created');
        });
        app.db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS notifications(" +
                            "ID INTEGER PRIMARY KEY ASC," +
                            "title TEXT," + 
                            "message TEXT)", 
                          [],
                          function (transaction, resultSet) {defer.resolve(resultSet) },
                          function (transaction, error) { defer.reject(error) });
        });

        return defer.promise();
    }
}

// Todo helper method
function viewMethods(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          console.log(i);
        }
    }
}

// Start application
app.initialize();
