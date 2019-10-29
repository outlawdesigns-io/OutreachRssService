"use strict";

const Record = require('./record');

class RssMatch extends Record{

  constructor(id){
    const database = 'outreach';
    const table = 'RssMatch';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'hostId',
      'articleCount',
      'matchCount',
      'executionDate'
    ];
  }
  static getAll(){
    let match = new RssMatch();
    return match.db.table(match.table).select('*').execute();
  }
}

module.exports = RssMatch;
