var express = require('express');
var app = express();
var request = require('request');
var cors = require('cors');
var path = require('path');
var loki = require('lokijs');
var config=require('config-json');
var AMT = require('./myServer');
//LokiDB to communicate with the database

var db = new loki('kuri.json', 
      {	autoload: true,
		//autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 1000
	  });
exports.db = db;

//Set the server port (to listen) 
var port = process.env.PORT || 3000;

//To cleat screen
var clear = require('clear');

var dataToSendObject = {
  data: {
    template: {},
    options: {
      title: {
        text: ""
      },
      series: [{}]
    }
  }
};
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
console.log('hello from server');
 res.render('./public/index.html');
});
app.get('/NewIntent',function(req,res){
res.sendFile(path.join(__dirname+'/NewIntent.html'));
});

app.get('/UpdateIntent',function(req,res){
  res.sendFile(path.join(__dirname+'/UpdateIntent.html'));
});

app.get('/DeleteIntent',function(req,res){
  res.sendFile(path.join(__dirname+'/DeleteIntent.html'));
});

//Read data from the data base

app.get('/readDataFromDB', function(reqUp, resUp) {	
	// var intent="quote.new";
	// var entity="quote.type_auto";
	var response = {};
	// var response ='{"responsetag": "hyperlink", "answertags": "answer,link,linktag", "answer":"Look below for the link to a job aid explaining how to start an auto quote.","link":"https://www.nationwide.com","linktag":"Start Auto Quote"}';
	console.log("inside the Method : ");
	//var data = JSON.parse(data);
	var intent = reqUp.param('intent');
	 console.log("insert intent to database : " + intent);
	var entity = reqUp.param('entity');
	 console.log("insert entity to database : " + entity);
	var responsetagData = reqUp.param('selectResponse');
	 console.log("insert responsetagData to database : " + responsetagData);
	var answertagsData = reqUp.param('answertag');
	 console.log("insert answertagsData to database : " + answertagsData);
	var answerData = reqUp.param('answer');
	 console.log("insert answerData to database : " + answerData);
	var entitytypeData = reqUp.param('entitytype');
	 console.log("insert entitytypeData to database : " + entitytypeData);
	var linkarrayData = reqUp.param('linkarray');
	 console.log("insert linkarrayData to database :" + linkarrayData);
	var iconarrayData = reqUp.param('iconarray');
	 console.log("insert iconarrayData to database : " + iconarrayData);
	 
	 /*var object = { "responsetag": responsetagData, "answertags": answertagsData, "answer": answerData, "entitytype": entitytypeData, "linkarray":linkarrayData, "iconarray":iconarrayData},
	 result = Object.keys(object).map(k => ({ [k]: object[k] }));
	 var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, linkarray:linkarrayData, iconarray: iconarrayData};
	 var result = JSON.stringify(object);
	 console.log( "\n Json Array by converting : "+result);
	 Object.keys(result).forEach(function(key) {
		console.log(key, result[key]);
	});
	 for (var key in result) {
		if (result.hasOwnProperty(key)) {
			console.log("Json Array by converting : "+key + " -> " + result[key]);
		}
	}
	 response[responsetag] = responsetagData;
	 response[answertags] = answertagsData;
	 response[answer] = answerData;
	 response[entitytype] = entitytypeData;
	 response[linkarray] = linkarrayData;
	 response[iconarray] = iconarrayData;
	 console.log( "\n Json Array by converting : "+JSON.stringify(response)); */
	
	if(responsetagData == "MultimediaResponse"){
		var answertagsData = "answer,linkarray,iconarray,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, linkarray:linkarrayData, iconarray: iconarrayData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting MultimediaResponse : "+result);	 
	}else if(responsetagData == "PromptsButtons"){
		var answertagsData = "answer,buttons,entity_type";
		var buttonsData = "Create Policy|Retrieve Account Policies|Retrieve Additional Policies";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, buttons:buttonsData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting PromptsButtons : "+result);	
	}else if(responsetagData == "Hyperlink"){
		var answertagsData = "answer,link,linktag,entity_type";
		var linkData = "https://www.nationwide.com";
		var linktagData = "Chat with a trainer";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, link:linkData, linktag: linktagData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Hyperlink : "+result);
	}else if(responsetagData == "Text"){
		var answertagsData = "answer,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Text : "+result);
	}
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
	var list = intentDB.find();
	response = result;
	AMT.createIntent( intent, entity, response );
	
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
	resUp.send({
      status: "Ok"
    });
});

exports.createIntent = function( intent, entity, response ) {
var intentDB = db.addCollection('intentDB');
//var responseTemp = response.replace(/\\\\/g, '');
//var responseStr = responseTemp.replace(/\\/g, '');
var responseStrR = JSON.parse(response);
console.log( "\n Json Array by converting responseStrR : "+responseStrR);
//var responseStr = responseStrR.replace(/\\/g, '');
//console.log( "\n Json Array by converting responseStr : "+responseStr);
//var responseStrR = JSON.parse(responseTemp);
 intentDB.insert({
  intent: intent,
  entity: entity,
  response: responseStrR
 });
//intentDB.insert([{entity: entity, intent: intent, response: response}]); // array type insertion in Loki jS
db.saveDatabase();
console.dir("inserted elements" +intent);
};


//Delete chart  deleteChart
app.get('/deleteChart', function(reqUp, resUp) {
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
	console.log("inside Delete Method : ");
	var intent = reqUp.param('intent');
	 console.log("insert intent to database : " + intent);
	var entity = reqUp.param('entity');
	 console.log("insert entity to database : " + entity);
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
	var list = intentDB.find();
	var aEntity = entity;
	var aIntent = intent;
	var count=0;
	for(var i = 0; i < entryCount; i++) {     		
		if(list[i].entity==entity && list[i].intent==intent){
			console.log("display String Intent from Loki: "+list[i].intent);
			console.log("display String aIntent from User: "+aIntent);
			console.log("display String Entity from Loki: "+list[i].entity);
			console.log("display String aEntity from User: "+aEntity);
			console.log("display String Response from Loki: "+list[i].response);
			count++;
			intentDB.remove(list[i]);
			console.log("Record based on Intent has been Deleted");
			}
          }
		console.log("Number of Count :"+count);
	  console.log("Please insert Entity and Intent in Loki..!");
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
return count;
});


//Update a intent in LokiDB
app.get('/updateChart', function(reqUp, resUp) {
	// var intent="quote.new";
	// var entity="quote.type_auto";
	var response = {};
	// var response ='{"responsetag": "hyperlink", "answertags": "answer,link,linktag", "answer":"Look below for the link to a job aid explaining how to start an auto quote.","link":"https://www.nationwide.com","linktag":"Start Auto Quote"}';
	console.log("inside the Method : ");
	var intent = reqUp.param('intent');
	 console.log("insert intent to database : " + intent);
	var entity = reqUp.param('entity');
	 console.log("insert entity to database : " + entity);
	var responsetagData = reqUp.param('selectResponse');
	 console.log("insert responsetagData to database : " + responsetagData);
	var answertagsData = reqUp.param('answertag');
	 console.log("insert answertagsData to database : " + answertagsData);
	var answerData = reqUp.param('answer');
	 console.log("insert answerData to database : " + answerData);
	var entitytypeData = reqUp.param('entitytype');
	 console.log("insert entitytypeData to database : " + entitytypeData);
	var linkarrayData = reqUp.param('linkarray');
	 console.log("insert linkarrayData to database :" + linkarrayData);
	var iconarrayData = reqUp.param('iconarray');
	 console.log("insert iconarrayData to database : " + iconarrayData); 
	
	if(responsetagData == "MultimediaResponse"){
		var answertagsData = "answer,linkarray,iconarray,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, linkarray:linkarrayData, iconarray: iconarrayData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting MultimediaResponse : "+result);	 
	}else if(responsetagData == "PromptsButtons"){
		var answertagsData = "answer,buttons,entity_type";
		var buttonsData = "Create Policy|Retrieve Account Policies|Retrieve Additional Policies";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, buttons:buttonsData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting PromptsButtons : "+result);	
	}else if(responsetagData == "Hyperlink"){
		var answertagsData = "answer,link,linktag,entity_type";
		var linkData = "https://www.nationwide.com";
		var linktagData = "Chat with a trainer";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData, link:linkData, linktag: linktagData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Hyperlink : "+result);
	}else if(responsetagData == "Text"){
		var answertagsData = "answer,entity_type";
		var object = {responsetag: responsetagData, answertags: answertagsData, answer: answerData, entity_type: entitytypeData};
		var result = JSON.stringify(object);
		console.log( "\n Json Array by converting Text : "+result);
	}
	response = result;
	/*var responseTemp = response.replace(/\\\\/g, '');
	var responseStr = responseTemp.replace(/\\/g, '');
	var responseStrR = JSON.parse(responseTemp);
	console.log( "\n Json Array by converting responseStrR : "+responseStrR);
	var responseStr = responseStrR.replace(/\\/g, '');
	console.log( "\n Json Array by converting responseStr : "+responseStr);*/
	var responseStrR = JSON.parse(response);
	console.log( "\n Json Array by converting responseStrR : "+responseStrR);
	response = responseStrR;
	var intentDB = db.getCollection('intentDB');
	var entryCount = db.getCollection("intentDB").count();
    console.log("number of entries in database : " + entryCount);
	var list = intentDB.find();
	var aEntity = entity;
	var aIntent = intent;
	var aResponse = response;
	var count=0;
	for(var i = 0; i < entryCount; i++) {     		
		if(list[i].entity==aEntity && list[i].intent==aIntent){
			console.log("display String Intent from Loki: "+list[i].intent);
			console.log("display String aIntent from User: "+aIntent);
			console.log("display String Entity from Loki: "+list[i].entity);
			console.log("display String aEntity from User: "+aEntity);
			 if(list[i].entity==aEntity && list[i].intent==aIntent){
					list[i].response = aResponse;
					intentDB.update(list[i]);
					count++;
				}else{
					console.log("unable to update");
				}
			}
          }
		console.log("Number of Count :"+count);
	  console.log("Record based on Intent has been Updated in Loki..!");
});


//           *** Start ***
clear(); //clear screen
console.log(' ***** Start session *** ');
console.log(' *****               *** ');
console.log(' ***** Agent Maintaianance Tool *** ');
console.log(' ***** Choose type of Operation in Dash Board *** ');
console.log(' *****               *** ');
app.listen(port);
