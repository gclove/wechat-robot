var WXDOM = require('../../config/wxDom');
var message = require('./message');
var turing = require('./turing');
var exactDirective = require('../directive/exact');
var fuzzyDirective = require('../directive/fuzzy');

var machine = {};

machine.reply = function(msg, isTextMsg, casperIns){
    console.log('正在处理消息... ');

    //非文字类消息
    if(!isTextMsg) return dealUnknownMsg(casperIns);

    //是否是指令
    if(isDiretive(msg, casperIns)) return;
    
    //非指令消息交给第三方机器人
    return dealByMachine(casperIns, msg);
}

//判断是否是指令
function isDiretive(msg, casperIns){
    for(var diretive in exactDirective){
        if(diretive == msg){
            casperIns.echo('接受到精确匹配指令 ' + diretive + ' ，正在处理...');
            exactDirective[diretive](msg, casperIns);
            return true;
        }
    }

    for(var diretive in fuzzyDirective){
        if(eval(diretive).test(msg)){
            casperIns.echo('接受到模糊匹配指令 ' + diretive + ' ，正在处理...')
            fuzzyDirective[diretive](msg, casperIns);
            return true;
        }
    }

    return false;
}

function dealUnknownMsg(casperIns){
    message.send(casperIns, '无法识别您发的消息。' + '\n\r发送时间：' + new Date().toLocaleString());
}

function dealByMachine(casperIns, msg){
    turing(casperIns, msg)
    // message.send(casperIns, '您发送的消息："' + msg + '"\n\r发送时间：' + new Date().toLocaleString());
}

module.exports = machine;