"use strict";

const Record = require('./record');

class Article extends Record{

  constructor(id){
    const database = 'outreach';
    const table = 'article_tracking';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'host',
      'title',
      'published'
    ];
  }
  static getAll(){
    let article = new Article();
    return article.db.table(article.table).select('*').execute();
  }
}

module.exports = Article;
