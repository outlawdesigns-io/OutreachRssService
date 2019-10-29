const feed = require('feed-read');

let hosts = [
  {uri:'http://nuclearthrashpossession.blogspot.com/feeds/posts/default',pattern:/(?<!Descargar)<b><a\shref="(.*?)"/,label:'NuclearThrash'},
  {uri:'http://dmfullalbums.blogspot.com/feeds/posts/default',pattern:/<span\sstyle="font-size:\slarge;"><a href="(.*?)"\starget="_blank">Download<\/a>/,label:'DmFullAlbums'},
  {uri:'http://true-black-metal.blogspot.com/feeds/posts/default',pattern:/;<a\shref="(.*?)"\starget="_blank"/,label:'TrueBlackMetal'},
  {uri:'http://slammingbrutallity.blogspot.com/feeds/posts/default',pattern:/<br\s\/><br\s\/><a\shref="(.*?)">/,label:'SlammingBurtality'},
  {uri:'https://technicaldeathmetal.org/feed/',pattern:/href="(.*)"\starget="_blank"\srel="noopener noreferrer">Download/,label:'TechnicalDeathMetal'},
  {uri:'http://finnishblackmetal.blogspot.ru/feeds/posts/default?alt=rss',pattern:/<br \/><a href="(.*)">Download<\/a>/,label:'FinnishBlackMetal'},
  {uri:'http://underblackmetal.blogspot.com/feeds/posts/default',pattern:/Genre:\s.*?href="(.*?)"\starget="_blank">/,label:'UnderBlackMetal'}
];

// var host = 'http://feeds.feedburner.com/darkmusicblog';
// var diabolusPattern = /<br \/><a\shref="(.*?)"><b>/;

let totalArticles = 0;
let totalMatches = 0;

hosts.forEach((host)=>{
  feed(host.uri,(err,articles)=>{
    if(err) throw err;
    let results = [];
    articles.forEach((article)=>{
      let res = article.content.match(host.pattern);
      if(res){
        let target = res[res.length - 1];
        results.push({title:article.title,published:article.published,target:target});
      }
    });
    console.table(results);
    console.log('Host: ' + host.label +  '\nArticles: ' + articles.length + '\nMatches: ' + results.length);
    totalArticles += articles.length;
    totalMatches += results.length
  });
});

setTimeout(()=>{
  let matchPercent = (totalMatches / totalArticles) * 100;
  console.log(matchPercent + '% matched');
},10000);
