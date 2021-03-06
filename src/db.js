"use strict";
var mysql = require('mysql');
class Db{
    constructor(host,user,password,database){
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.con = mysql.createConnection({host:this.host,user:this.user,password:this.password});
        this.query = '';
    }
    table(table){
        this.useTable = this.database + '.' + table;
        return this;
    }
    select(selectStr){
        this.query = 'SELECT ' + selectStr + ' FROM ' + this.useTable;
        return this;
    }
    where(whereStr){
        this.query += ' WHERE ' + whereStr;
        return this;
    }
    andWhere(whereStr){
        this.query += ' AND ' + whereStr;
        return this;
    }
    orWhere(whereStr){
        this.query += ' OR ' + whereStr;
        return this;
    }
    update(updateObj){
        this.query = 'UPDATE ' + this.useTable + ' SET ';
        var value;
        var i = 0;
        var max = Object.keys(updateObj).length - 1;
        for(value in updateObj){
            if(i++ < max){
                this.query += value + '=' + "\'" + updateObj[value] + "\',";
            }else{
                this.query += value + '=' + "\'" + updateObj[value] + "\'";
            }
        }
        return this;
    }
    insert(insertObj){
        this.query = 'INSERT INTO ' + this.useTable + '(';
        var keys = Object.keys(insertObj);
        var max = keys.length - 1;
        var i = 0;
        var k;
        for(k in keys){
            if(i++ < max){
                this.query += keys[k] + ',';
            }else{
                this.query += keys[k] + ')';
            }
        }
        this.query += ' VALUES (';
        i = 0;
        var value;
        for(value in insertObj){
            if(i++ < max){
                this.query += "\'" + insertObj[value] + "\',";
            }else{
                this.query += "\'" + insertObj[value] + "\')";
            }
        }
        return this;
    }
    orderBy(orderBy){
        this.query += ' ORDER BY ' + orderBy;
        return this;
    }
    execute(){
        return new Promise((resolve,reject)=>{
            this.con = mysql.createConnection({host:this.host,user:this.user,password:this.password});
            this.con.query(this.query,(err,rows)=>{
                if(err){
                    return reject(err);
                }else{
                    this.close().then(()=>{
                        resolve(rows);
                    },(err)=>{
                        reject(err);
                    });
                }
            })
        });
    }
    close(){
        return new Promise((resolve,reject)=>{
            this.con.end(err=>{
                if(err){
                    return reject(err);
                }
                resolve();
            });
        });
    }
    static date(dateStr){
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        if(dateStr === undefined){
            return (new Date(Date.now() - tzoffset)).toISOString().substring(0, 19).replace('T', ' ');
        }
        return (new Date(Date.parse(dateStr) - tzoffset)).toISOString().substring(0, 19).replace('T', ' ');
    }
}
module.exports = Db;
