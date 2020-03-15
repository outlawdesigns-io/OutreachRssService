const outreach = require('./src/outreach');
const host = require('./src/host');
const RssMatch = require('./src/rssMatch');

let crawlJobStr = '';
let _crawlJobDir = './jDownloader/folderwatch/';
let _downloadDir = '/tmp/rssResults/';
outreach.downloadDir(_downloadDir);
outreach.crawlJobDir(_crawlJobDir);

setInterval(()=>{
  host.getAll().then((hosts)=>{
    hosts.forEach((host)=>{
      if(host.online && host.active){
        host.url = 'http://' + host.host + '/' + host.feed_uri;
        host.download_pattern = new RegExp(host.download_pattern);
        outreach.parseFeed(host).then((links)=>{
          console.table(links);
          console.log(host.host + '\nArticles: ' + outreach.hosts()[host.host] + '\nMathces: ' + links.length);
          let newMatch = new RssMatch();
          newMatch.hostId = host.id;
          newMatch.articleCount = outreach.hosts()[host.host];
          newMatch.matchCount = links.length;
          newMatch.executionDate = RssMatch._date();
          newMatch._create();
          links.forEach((link)=>{
            crawlJobStr += outreach.crawlJobStr(host.host,link.downloadUri);
          });
        },console.error).catch(console.error);
      }
    });
    setTimeout(()=>{
      console.log('Found matches in ' + outreach.matchPercent() + '% of articles');
      outreach.writeCrawlJob(crawlJobStr).then((result)=>{
        console.log('CrawlJob Saved to ' + _crawlJobDir);
      },console.error).catch(console.error);
    },hosts.length * 2000);
  },console.error).catch((err)=>{
    throw err;
  });
},86400000);
