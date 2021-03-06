const {Command, flags} = require('@oclif/command')
const scrapy = require('../helpers/src/lib/scrapy')
const config = require('../helpers/src/config.json')
const log = require('../helpers/src/lib/log')

class DownloadPlaylistCommand extends Command {
  async run() {
    const {flags} = this.parse(DownloadPlaylistCommand)
    const name = flags.name || '/playlist/17842802'
    const downloadDir = flags.DownloadDir || './downloads'
    const playlists = flags.Playlists || ''
    this.log(playlists)

    //this.log(`hello ${name} from D:\\apps\\PersonalApps\\Test02\\DownloaderCLI\\src\\commands\\DownloadPlaylist.js`)
    this.log(`\nStarting Download for ${name} \n`)

    const page = config.page || 1;
    const search = config.search;
  
    try {
      while (true) {
        const opts = {
          page,
          search,
          pathname: name
        };
        const keys = await scrapy.findKeys(opts);
        if (!keys || keys.length === 0) {
          throw new Error('find nothing!');
        }
        log.info(keys);
        for (const key of keys) {
          const info = await scrapy.findDownloadInfo(key);
          if (!info) {
            log.info('can\'t find this video, downloading next one');
            continue;
          }
          const result = await scrapy.downloadVideo(info, downloadDir);
          log.info(result);
          console.log('\n');
        }
  
        page += 1;
      }
    } catch (error) {
      console.log(error);
      process.exit(0);
    }
  }
}

DownloadPlaylistCommand.description = `Describe the command here
...
Extra documentation goes here
`

DownloadPlaylistCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
  DownloadDir: flags.string({char: 'd', description: 'Directory to download the files to'}),
}

module.exports = DownloadPlaylistCommand
