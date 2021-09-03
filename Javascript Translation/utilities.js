const {Sequelize, DataTypes, QueryTypes} = require("sequelize");
let sqlite3 = require("sqlite3").verbose();


const database_path = "sqlite::memory"; //replace with whatever database gets used in final result



export default class Utilities {

    static DB_PATH = null;

    static __instance = null;
    static db = null;
    static client = null;
    
    static last_message_was_youtube_question = null;
    static latest_comment_timestamp = null;
    static last_check_timestamp = null;
    static youtube_cooldown = null;
    static last_timestamp = null;
    static last_question_asked_timestamp = null;
    static latest_question_posted = null;

    static users = null;
    static ids = null;
    static index = null;
    static scores = null;

    static modules_dict = {};

    static get_instance () {
        if(Utilities.__instance == null) {
            new Utilities();
        }
        return Utilities.__instance;
    }

    constructor() {
        if(Utilities.__instance != null) {
            throw "This class is a singleton!"
        } else {
            Utilities.__instance = this;
            this.start_time = Date.now();
            this.DB_PATH = database_path;
            this.db = new Sequelize(database_path); //TODO: implement the database; modify queries to it accordingly.
            this.UserVotes = this.db.define('uservotes', {
                user: { //This field, as well as voted_for, should both be Near Wallet IDs.
                    type: DataTypes.STRING,
                    allowNull: false
                },
                sourceName: {
                    type: DataTypes.STRING
                },
                votedFor: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                targetTransaction: {
                    type: DataTypes.STRING
                },
                votecount: {
                    type: DataTypes.FLOAT,
                    allowNull: false
                }
            },
            { freezeTableName: true });
        }

    }

    async init() {
        await this.db.query("CREATE TABLE IF NOT EXISTS uservotes (user VARCHAR(64), sourceName VARCHAR(2048), votedFor VARCHAR(64), targetTransaction VARCHAR(2048), votecount FLOAT, id VARCHAR(64), createdAt BIGINT, updatedAt BIGINT)");
        await this.UserVotes.create({user: "alice", sourceName: "seed_username", votedFor: "bob", targetTransaction: "seed_transaction",  votecount: 7});
    }

    clearVotes() {
        const query = "DELETE FROM uservotes";
        this.db.query(query);
    }

    update_ids_list() {
        this.ids = this.users.sort();;
        this.index = {0: 0};
        for(let i = 0; i < this.ids.length; i++) {
            let userid = this.ids[i];
            this.index[userid] = this.ids.indexOf(userid);
        }
    }

    index_dammit(user) {
        //get an index into the scores array from whatever you get.
        if (user in this.index) {
            //maybe we got a valid ID?
            return this.index[user];
        } else if (user.toString() in this.index) {
            return this.index[user.toString()];
        }
        //Maybe we got a User or Member object that has an ID?
        let uid = user.id ? user.id : null;
        console.log(uid);
        console.log(this.index);
        if (uid) {
            return this.index_dammit(uid);
        }

        return null;
    }

    get_user_score(user) {
        let userIndex = this.index_dammit(user);
        if (userIndex) {
            return this.scores[index];
        }
        return 0.0;
    }
    //A series of databse functions follow. Modify based on db implementation.
    async update_vote(user, user_name, voted_for, voted_for_transaction, vote_quantity) {
        let query = (`INSERT OR REPLACE INTO uservotes (user, sourceName, votedFor, targetTransaction, votecount) VALUES ('${user}', '${user_name}', '${voted_for}', '${voted_for_transaction}', IFNULL((SELECT votecount ` +
            `FROM uservotes WHERE user = '${user}' AND votedFor = '${voted_for}'),0)+${vote_quantity})`); 
        await this.db.query(query);
    }

    async get_votes_by_user(user){
        const query = `SELECT IFNULL(sum(votecount),0) FROM uservotes where user = '${user}'`;
        return (await this.db.query(query))[0][0]["sum(votecount)"];
    }

    async get_votes_for_user(user){
        const query = `SELECT IFNULL(sum(votecount),0) FROM uservotes where votedFor = '${user}'`;
        return (await this.db.query(query))[0][0]["sum(votecount)"];
    }

    async get_total_votes(){
        const query = "SELECT sum(votecount) from uservotes where user is not 0";
        return (await this.db.query(query))[0][0]["sum(votecount)"];
    }

    async get_all_user_votes(){
        return await this.UserVotes.findAll();
    }

    async get_users() {
        const query = "SELECT user from (SELECT user FROM uservotes UNION SELECT votedFor as user FROM uservotes)";
        const result = (await this.db.query(query, {type: QueryTypes.SELECT}));
        let users = [];
        for (let i = 0; i < result.length; i++) {
            users.push(result[i]["user"]);
        }
        return users;
    }

}