"use strict";

const Record = require('./record');

class CrawlJobLink extends Record{

  constructor(id){
    const database = 'outreach';
    const table = 'CrawlJobLink';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'hostId',
      'articleId',
      'downloadUri'
    ];
  }
  static getAll(){
    let crawlJob = new CrawlJobLink();
    return crawlJob.db.table(crawlJob.table).select('*').execute();
  }
}

module.exports = CrawlJobLink;
