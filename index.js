
const Discord = require('discord.js');

const client  = new Discord.Client();

const fetch = require('node-fetch');
const querystring = require('querystring');    

const token = 'NzQ3Mjk2MzY1NjEyMzY3ODg0.X0Mz-Q.K-_vRf8Itsd5mMZg1eIJgHXKdjo';
const prefix = '!';

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

client.once('ready', () =>{
    console.log('disCF is online');
});

client.on('message', async message => {

    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'cat'){
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
        message.channel.send(file);
    }

    if(command === 'urban'){
        if(!args.length){
            return message.channel.send('You need to supply a search term!');
        }
            const query = querystring.stringify({ term: args.join(' ') });;

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
        if(!list.length){
            return message.channel.send(`No results found for **${args.join(' ')}**.`);       
        }else{
            message.channel.send(list[0].definition);
            message.channel.send('link: ' + list[0].permalink)
        }
    }

    if(command === 'contest'){
        const { result } = await fetch('https://codeforces.com/api/contest.list?gym=false').then(response => response.json());

        const [ answer ] = result;
        
        const embed = new Discord.MessageEmbed()
            .setColor('#33ffc7')
            .setTitle(answer.name)
            .setURL('https://codeforces.com/contestRegistration/' + answer.id)
            .addFields(
                {name: 'Name', value: trim(answer.name, 1024)},
                {name: 'Type', value: trim(answer.type, 1024)},
                {name: 'Status / Phase', value: trim(answer.phase, 1024).toLowerCase() + ' the contest'},
                {name: 'Duration', value: trim(answer.durationSeconds, 1024) + ' seconds'}
            )

        if(!result.length){
            message.channel.send('There is no contests');
        }else{
            message.channel.send(embed);
        }
    }
})

client.login(token);