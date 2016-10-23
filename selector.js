/**
 * Created by mojtaba on 10/22/16.
 */
var prompt = require('prompt');
var fs = require('fs');
var personals = require('./personal.json').personals;
var history = require('./history.json');
var exceptionList=[];

function selectMayor(){
    personals.forEach(function(person){
        if(exceptionList.filter(function(experson){
                return experson.name==person.name
            }).length>0)person.qouta=0;
        else if (!history[person.name])person.qouta = personals.length;
        else person.qouta = (Date.now() - history[person.name]) / (24 * 60 * 60 * 1000);
    });
    var maxq=0;
    var selectedPreson;
    personals.forEach(function(person){
        if(person.qouta>maxq){
            selectedPreson=person;
            maxq=person.qouta;
        }
    });
    return selectedPreson||{};
}
function selectMayorByConsole() {
    var selectedPerson=selectMayor();
    if(!selectedPerson.name){
        console.log("no one exist , gfy");
        process.exit();
    }
    var key="is "+selectedPerson.name+" here?";
    prompt.get(key,function(err,result){
        if(err){console.log(err);prompt.stop();}
        if (result[key] == 'y'){
            prompt.stop();
            history[selectedPerson.name] = Date.now();
            fs.writeFile('./history.json', JSON.stringify(history), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            console.log("GOOD LUCK");
        }
        else if(result[key]=='n'){
            exceptionList.push(selectedPerson);
            console.log("ok lets take another");
            selectMayorByConsole();
        }
    });
}
prompt.start();
selectMayorByConsole();
