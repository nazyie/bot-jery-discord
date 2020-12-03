const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const BOT_FILE = './data/BOT_DATA.json';

const {prefix, token} = require('./config.json');

var BOT_DATA = require('./data/BOT_DATA.json');
var count = parseInt(BOT_DATA.slice(-1)[0].id);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('message', msg => {
  if(msg.content.startsWith(prefix)){
    userCommand = msg.content.slice(6).toLowerCase();
    command = userCommand.split(' ')
    switch(command[0])
    {
      case "list-command":
        commandList(msg);
        break;

      case "add-task":
        addTask(msg);
        break;

      case "show-task":
        showTask(msg);
        break;

      case "edit-task":
        editTask(msg);
        break;

      case "delete-task":
        deleteTask(msg);
        break;

      default:
        defaultMessage(msg);
    }
    syncData();
  }
});

// function for add information
function commandList(msg)
{
  const listCommand = 
  '**Here is the command**' +
  '```' +
  '1. -jery add-task => add-task [task_title] [task_text] [date|12/09]\n' +
  '2. -jery show-task => show-task\n' +
  '3. -jery edit-task => edit-task [task_code] [what_to_edit] [edit]\n' +
  '4. -jery delete-task => delete-task [task_code]\n' +
  '```'
  ;

  msg.channel.send(listCommand);
}

// function for inform all the people in the group
// function for add task
function addTask(msg)
{
  const dateRegex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/i;

  let content = msg.content;
  let info = content.slice(15).split(' ');
  let dateCreate = info.find(value => {return dateRegex.test(value)});
  info.pop();
  let title = info[0];
  let desc = info.slice(1).join().replace(/,/g, ' ');
  count++;
  let id = count.toString();

  let newTask = {
    "id" : id,
    "title" : title,
    "task" : desc,
    "date" : dateCreate,
  };

  if(dateCreate && info[1] && info[2]){
    BOT_DATA.push(newTask);
    msg.reply('Task has been store! Shabas Mahasiswa.');
  }else{
    msg.reply('Syntax task error!. Task not been saved!');
  }
}

// function for show task
function showTask(msg)
{
  let showTask = 
  '----------------------------------------------------------\n' + 
  '**Kerja yang kene buat Mahasiswa Palatao Sekalian**\n' +
  '----------------------------------------------------------\n\n' +
  '```';

  BOT_DATA.forEach((elem, index) => {
    for(var key in elem) {
     showTask += elem[key] + '\t\t'; 
    }
    showTask += '\n';
    });
  
  showTask += '```';

  msg.channel.send(showTask);
}

// function for edit task
function editTask(msg)
{
  let input = msg.content;
  let content = input.slice(16).split(' ')
  let id = content[0];
  let arg = content[1];
  let info = content.slice(2);
  let data = info.join().replace(/,/g, ' ');

  let dataPos = BOT_DATA.findIndex(elem => elem.id == id);
  let tempArr = BOT_DATA[dataPos];
  console.log('function for editask: ' + id + ' outcome :' + dataPos.toString());

  if(dataPos != -1){
    switch(arg){
      case 'title':
        BOT_DATA.splice(dataPos, 1);
        tempArr.title = data;
        BOT_DATA.push(tempArr);
        msg.channel.send('Here is the changes, ' + '```' + JSON.stringify(tempArr)) + '```';
        break;

      case 'task':
        BOT_DATA.splice(dataPos, 1);
        tempArr.desc = data;
        BOT_DATA.push(tempArr);
        msg.channel.send('Here is the changes, ' + '```' + JSON.stringify(tempArr)) + '```';
        break;

      case 'date':
        BOT_DATA.splice(dataPos, 1);
        tempArr.date = data;
        BOT_DATA.push(tempArr);
        msg.channel.send('Here is the changes, ' + '```' + JSON.stringify(tempArr) + '```');
        break;

      default:
        msg.channel.send('Wrong syntax.' + '```' + '-jery edit-task [task no] [title|task|date] [data_want_change]' + '```')
    }
  }else{
    msg.reply('Task ID:' + id + ' not found! or wrong syntax!');
  }
}

// function for delete task
function deleteTask(msg)
{
  content = msg.content;
  arg = content.slice(18);

  let dataPos = BOT_DATA.findIndex(elem => elem.id == arg);
  let tempArr = BOT_DATA[dataPos];
  console.log('function for editask: ' + arg + ' outcome :' + dataPos.toString());

  if(dataPos != -1){
    BOT_DATA.splice(dataPos, 1)
    msg.reply('Task ID:' + arg + '\n```' + JSON.stringify(tempArr) +'```');
  }else{
    msg.reply('Task not found! or wrong syntax!');
  }
}

// function for trigger the task
// function for tell if they noisy
// function say something nice each day

// function for wrong command
function defaultMessage(msg)
{
  const ErrorMess = 'Stop Berpalatao Mahasiwa Sekalian, Wrong command ! Please type: ' + '```' + '-jery list-command' + '```' + 'to list all command';

  msg.reply(ErrorMess);
}

// function update data
function syncData()
{
  let data = JSON.stringify(BOT_DATA);
  fs.truncate(BOT_FILE, 0, () => {console.log('File deleted')});

  fs.writeFile(BOT_FILE, data, (err) => { if(err){throw err;} });
}
