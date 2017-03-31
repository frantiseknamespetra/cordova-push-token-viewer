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
var indexPage = {

    initialize: function() {

        this.$senderID = $('#senderID');
        this.tokenVal = null;

        this.pushNotificationClient = new PushNotificationCLient();

        this.pushNotificationClient.onRegistration = function(token) {
            indexPage.tokenVal = token;
            indexPage.showToken()
        } 

        this.pushNotificationClient.initAndroid(this.$senderID.val());

        indexPage.bindEvents();
    },

    showToken: function() {
       $('#token').val(indexPage.tokenVal)
    },

    bindEvents: function() {
        window.addEventListener('push', function(e) {
            if (e.detail.state.url.indexOf('index.html') > 0) {
                indexPage.showToken();
            }
        })   
        window.addEventListener("beforeunload", function(e) {
            console.log("Write something clever here..");
            console.log(JSON.stringify(e))
        }); 
    }
};
