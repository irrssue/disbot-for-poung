const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('1159193141858013328');


const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

client.on('messageCreate', async message => {
  if (message.content.startsWith('/play ')) {
    const url = message.content.split(' ')[1]; // Get URL from message
    const channel = message.member.voice.channel; // Get voice channel of the member
    
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: 'audioonly' }); // Get audio stream from URL
    const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

    const player = createAudioPlayer();
    player.play(resource);

    player.once(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    connection.subscribe(player);
  }
});
