"use strict";

const Record = require('./record');

class Host extends Record{

  constructor(id){
    const database = 'outreach';
    const table = 'hosts';
    const primaryKey = 'id';
    super(database,table,primaryKey,id);
    this.publicKeys = [
      'id',
      'host',
      'feed_uri',
      'download_pattern'
    ];
  }
  static getAll(){
    let host = new Host();
    return host.db.table(host.table).select('*').execute();
  }
}

module.exports = Host;
