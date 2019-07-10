const apn = require("./apnconfigtest");

let noteObject = {};
noteObject.alert = 'Hello Boizzzzz'
noteObject.badge = 1;
noteObject.payload = { 'messageFrom': 'Dasby' };
noteObject.topic = "org.reactjs.native.dasbytest";
apn.sendNotification(noteObject, "2ae5940130dd7fb47347303a59b83152b4b7bdbfa767391c97f3a56cb4be8994")
