var app = (function(){
    const feed = require('feed-read');
    const fs = require('fs');
    const Article = require('./article');
    const RssMatch = require('./rssMatch');
    const CrawlJobLink = require('./crawlJobLink');
    let _crawlJobDir = '';
    let _downloadDir = '';
    let _articleCount = 0;
    let _matchCount = 0;
    let _hosts = {};
    let _createdArticleIds = {};
    function _setCrawlJobDir(path){
      _crawlJobDir = path;
      return _crawlJobDir;
    }
    function _setDownloadDir(path){
      _downloadDir = path;
      return _downloadDir;
    }
    function _buildCrawlJobStr(host,url){
      let str = "downloadFolder=" + _downloadDir + "\n";
      str += "packageName=" + host + "\n";
      str += "autoStart=false\n";
      str += "text=" + url + "\n";
      return str;
    }
    function _isNewArticle(testArticle,articleHistory){
      for(i in articleHistory){
        if(articleHistory[i].title === testArticle.title){
          return false;
        }
      }
      return true;
    }
    async function _parseArticles(host,articles){
      let newArticles = [];
      let articleHistory = await Article.getAll();
      _hosts[host] = 0;
      for(i in articles){
        let testArticle = articles[i];
        if(_isNewArticle(testArticle,articleHistory)){
          let newArticle = new Article();
          newArticle.host = host;
          newArticle.title = testArticle.title;
          newArticle.published = Article._date(testArticle.published);
          let created = await newArticle._create();
          testArticle.id = created.id;
          _articleCount++;
          _hosts[host]++;
          newArticles.push(testArticle);
        }
      }
      return newArticles;
    }
    function _parseLinks(articles,host){
      let links = [];
      for(i in articles){
        res = articles[i].content.match(host.download_pattern);
        if(res){
          let newLink = new CrawlJobLink();
          newLink.hostId = host.id;
          newLink.articleId = articles[i].id;
          newLink.downloadUri = res[res.length - 1];
          newLink._create();
          links.push(newLink._buildPublicObj());
          _matchCount++;
        }
      }
      return links;
    }
    function _writeCrawlJob(str){
      return new Promise((resolve,reject)=>{
        let path = _crawlJobDir + Article._date().replace(/\:/g,'.') + '.crawljob';
        fs.writeFile(path,str,(err)=>{
          if(err){
            reject(err);
          }
          resolve(true);
        });
      });
    }
    return {
        parseFeed:function(host){
          return new Promise((resolve,reject)=>{
            feed(host.url,(err,articles)=>{
              if(err) reject(err);
              _parseArticles(host.host,articles).then((newArticles)=>{
                resolve(_parseLinks(newArticles,host));
              },reject).catch(reject);
            });
          });
        },
        matchPercent:function(){
          return Math.round((_matchCount / _articleCount) * 100);
        },
        matchCount:function(){
          return _matchCount;
        },
        articleCount:function(){
          return _articleCount;
        },
        hosts:function(){
          return _hosts;
        },
        crawlJobDir:function(path){
          return _setCrawlJobDir(path);
        },
        downloadDir:function(path){
          return _setDownloadDir(path);
        },
        crawlJobStr:function(host,url){
          return _buildCrawlJobStr(host,url);
        },
        writeCrawlJob:function(str){
          return _writeCrawlJob(str);
        }
    };
})();

module.exports = app;
