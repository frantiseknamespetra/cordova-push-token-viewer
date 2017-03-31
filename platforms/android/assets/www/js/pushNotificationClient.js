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
function PushNotificationCLient() {
    this.push = null;
    this.token = null;
    this.onRegistration = function(token) {}
}

PushNotificationCLient.prototype.initAndroid = function(senderId) {
    console.log("Initializing PushNotificationClient with senderID: " + senderId)
    this.push = PushNotification.init({
        android: {
            senderID: senderId
        }
    });

    this.push.on('registration', $.proxy(pushOnRegistration, this));
    this.push.on('notification', $.proxy(pushOnNotification, this));
    this.push.on('error', $.proxy(pushOnError, this));
} 

function pushOnRegistration(data) {
    // data.registrationId
    console.log('RegistrationId: ' + data.registrationId);
    this.token = data.registrationId
    this.onRegistration(this.token)
}

function pushOnNotification(data) {
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData  
    console.log('Notification received: ' + data.message);

    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO notifications(title, message) VALUES (?,?)", [data.title, data.message], 
                       function (transaction, resultSet) { console.log('Notification has been inserted.') },
                       function (transaction, error) { console.log('Error: ' + error.message) })        
    });
}

function pushOnError(e) {
    // e.message
    console.log('Error received: ' + e.message);
}  