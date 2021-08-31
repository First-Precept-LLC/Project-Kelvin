const {Sequelize, DataTypes} = require("sequelize");


const database_path = "sqlite::memory"; //replace with whatever database gets used in final result

const sequelize = new Sequelize(database_path);

const UserVotes = sequelize.define('uservotes', {
    user: { //This field, as well as voted_for, should both be Near Wallet IDs.
        type: DataTypes.STRING,
        allowNull: false
    },
    votedFor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    votecount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
},
{ freezeTableName: true });



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
            Utilities();
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
        }

    }

    clearVotes() {
        const query = "DELETE FROM uservotes";
        this.db.query(query);
    }

    update_ids_list() {
        this.ids = this.users.sort();;
        this.index = {0: 0};
        for(let i = 0; i < this.ids.length; i++) {
            userid = this.ids[i];
            this.index[userid] = this.ids.index(userid);
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
    update_vote(user, voted_for, vote_quantity) {
        query = (`INSERT OR REPLACE INTO uservotes VALUES (${user},${voted_for},IFNULL((SELECT votecount ` +
            `FROM uservotes WHERE user = ${user} AND votedFor = ${voted_for}),0)+${vote_quantity})`); 
        this.db.query(query);
    }

    get_votes_by_user(user){
        const query = `SELECT IFNULL(sum(votecount),0) FROM uservotes where user = ${user}`;
        return this.db.query(query)[0][0];
    }

    get_votes_for_user(user){
        const query = `SELECT IFNULL(sum(votecount),0) FROM uservotes where votedFor = ${user}`;
        return this.db.query(query)[0][0];
    }

    get_total_votes(){
        const query = "SELECT sum(votecount) from uservotes where user is not 0";
        return this.db.query(query)[0][0];
    }

    get_all_user_votes(){
        return UserVotes.findAll();
    }

    get_users() {
        const query = "SELECT user from (SELECT user FROM uservotes UNION SELECT votedFor as user FROM uservotes)";
        const [result, metadata] = this.db.query(query);
        let users = [];
        for (let i = 0; i < result.length; i++) {
            let sublist = reult[i];
            for(let j = 0; j < result.length; j++) {
                let item = sublist[j];
                users.push(item);
            }
        }
        return users;
    }

}