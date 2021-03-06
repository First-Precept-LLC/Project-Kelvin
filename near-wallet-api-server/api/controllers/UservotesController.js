/**
 * UservotesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { MongoClient } = require('mongodb');
const stampy_id = "stampy";



const database_path = "mongodb+srv://admin:jellynightfatherwheel@cluster0.7phke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = new MongoClient(database_path, { useNewUrlParser: true, useUnifiedTopology: true });//TODO: implement the database; modify queries to it accordingly.

const {Matrix, solve} = require('ml-matrix'); //npm install this
const readline = require('readline');
const f = require('fs');

const admin_usernames = []; //Either fill with admins, or remove

const PAGE_SIZE = 5;




class Utilities {

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
            this.client = client;
            Utilities.__instance = this;
            this.start_time = Date.now();
        }

    }

    async init() {
        await client.connect();
        this.UserVotes = client.db("Kelvin").collection("uservotes");
		this.Transactions = client.db("Kelvin").collection("transactions");
    }

    async clearVotes() {
        await this.UserVotes.deleteMany({});
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
		console.log(user);
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
    async update_vote(userwallet, user_name, voted_for, voted_for_transaction, vote_quantity) {
        let insertedObj = {
            user: userwallet,
            sourceName: user_name,
            votedFor: voted_for,
            targetTransaction: voted_for_transaction,
            votecount: vote_quantity 
        };
        await this.UserVotes.insertOne(insertedObj);
    }
	
	async add_transaction(id, amount_sent, fromId, toId, desc) {
		let insertedObj = {
			transactionId: id,
			amountSent: parseFloat(amount_sent),
			from: fromId,
			to: toId,
			description: desc,
			timestamp: new Date().getTime()
		};
		await this.Transactions.insertOne(insertedObj);
		return true;
	}

    async get_votes_by_user(userwallet){
        let allUserVotes = await this.UserVotes.find({user: userwallet}).toArray();
        let total = 0;
        for (let i = 0; i < allUserVotes.length; i++) {
            total += allUserVotes[i].votecount;
        }
        return total;
    }

    async get_votes_for_user(userwallet){
        let allUserVotes = await this.UserVotes.find({votedFor: userwallet}).toArray();
        let total = 0;
        for (let i = 0; i < allUserVotes.length; i++) {
            total += allUserVotes[i].votecount;
        }
        return total;
    }

    async get_votes_by_transaction(transaction){
        let allUserVotes = await this.UserVotes.find({targetTransaction: transaction}).toArray();
        let total = 0;
        for (let i = 0; i < allUserVotes.length; i++) {
            total += allUserVotes[i].votecount;
        }
        return total;
    }

    async get_total_votes(){
        let allUserVotes = await this.UserVotes.find({}).toArray();
        let total = 0;
        for (let i = 0; i < allUserVotes.length; i++) {
            total += allUserVotes[i].votecount;
        }
        return total;
    }

    async get_all_user_votes(){
        return await this.UserVotes.find({}).toArray();
    }

    async get_users() {
        let users = [];
        let allUserVotes = await this.UserVotes.find({}).toArray();
        for (let i = 0; i < allUserVotes.length; i++) {
            if(! users.includes(allUserVotes[i].user)) {
                users.push(allUserVotes[i].user);
            }
            if(! users.includes(allUserVotes[i].votedFor)) {
                users.push(allUserVotes[i].votedFor);
            }
        }
        return users;
    }
	
	async get_transaction_page(page_number) {
		let offset = PAGE_SIZE * (page_number - 1);
		return (await this.Transactions.aggregate([{$sort: {timestamp: -1}}, {$skip: offset}, {$limit: PAGE_SIZE}])).toArray();
	}

}

class StampsModule {
    toString() {
        return "Stamps module";
    }

    constructor() {
        this.utils = Utilities.get_instance();
        this.red_stamp_value = 1;
        this.gold_stamp_value = this.red_stamp_value * 5;
		this.half_red_stamp_value = .5;
		this.half_gold_stamp_value = 2.5;
		this.zero_stamp_value = 0;
		
        this.user_karma = 1.0;
    }

    async init() {
        await this.utils.init()
        this.total_votes = await this.utils.get_total_votes();
        await this.calculate_stamps(); 
    }

    reset_stamps() {
        console.log("WIPING STAMP RECORDS");
        this.utils.clearVotes()
        this.utils.update_vote('alice', 'alice_name', 'bob', 'seed_transaction', 7); //Generate start set IDs and replace these
    }

    async update_vote(stamp_type, from_id, from_name, to_id, to_transaction, negative=false, recalculate=true){
        if (to_id == stampy_id) {
            //votes for stampy do nothing
            return false;
        }
        if(to_id == from_id) {
            //votes for yourself do nothing
            return false;
        }

        let vote_strength = 0;

        if (stamp_type == "stamp") {
            vote_strength = this.red_stamp_value;
        } else if (stamp_type == "goldstamp") {
            vote_strength = this.gold_stamp_value;
        } else if (stamp_type == "halfstamp") {
			vote_strength = this.half_red_stamp_value
		} else if (stamp_type == "halfgoldstamp") {
			vote_strength = this.half_gold_stamp_value;
		}

        if (negative) {
            vote_strength = -vote_strength;
        }

        this.total_votes += vote_strength;
        await this.utils.update_vote(from_id, from_name, to_id, to_transaction, vote_strength);
        this.utils.users = await this.utils.get_users();
        this.utils.update_ids_list();
        if (recalculate) {
            this.calculate_stamps();
        }
        return true;
    }

    async calculate_stamps() {
        //set up and solve the system of linear equations
        console.log("RECALCULATING STAMP SCORES");

        this.utils.users = await this.utils.get_users();
        this.utils.update_ids_list();

        let user_count = this.utils.users.length;

        let users_matrix = Matrix.zeros(user_count, user_count);

        let votes = await this.utils.get_all_user_votes();

        for(let i = 0; i < votes.length; i++) {
            let from_id = votes[i]['user']; //This may change depending on the database implementation and what objects returned from the database look like
            let to_id = votes[i]['votedFor'];
            let votes_for_user = votes[i]['votecount'];
            let from_id_index = this.utils.index[from_id];
            let toi = this.utils.index[to_id];
            let total_votes_by_user = await this.utils.get_votes_by_user(from_id);
            if (total_votes_by_user != 0) {
                let score = (this.user_karma * votes_for_user) / total_votes_by_user;
                users_matrix.set(toi, from_id_index, score); 
            }

        }

        for (let i = 1; i < user_count; i++) {
            users_matrix.set(i, i, -1.0);
        }

        users_matrix.set(0, 0, 1.0);

        let user_count_matrix = Matrix.zeros(user_count, 1);
        user_count_matrix.set(0, 0, 1.0); //God has 1 karma

        this.utils.scores = solve(users_matrix, user_count_matrix).to1DArray();

        this.print_all_scores();
        //done
    }

    async get_user_scores() {
        const message = "Here are the users and how many stamps they're worth:\n";
        this.utils.users = await this.utils.get_users();
        for (let i = 0; i < this.utils.users.length; i++) {
            let user_id = this.utils.users[i];
            let name = "<@" + String(user_id) + ">"; //Format as necessary
            let stamps = this.get_user_stamps(user_id);
            message += name + ": \t" + String(stamps) + "\n";
        }
        return message;
    }

    async print_all_scores() {
        let total_stamps = 0;
        this.utils.users = await this.utils.get_users();
        for (let i = 0; i < this.utils.users.length; i++) {
            let user_id = this.utils.users[i];
            let name = "<@" + String(user_id) + ">"; //Format as necessary
            let stamps = this.get_user_stamps(user_id);
            total_stamps += stamps;
            console.log(name + "\t" + String(stamps));
        }
        console.log("Total votes:" + String(this.total_votes));
        console.log("Total stamps:" + String(total_stamps));
    }

    get_user_stamps(user) {
		if (!user) {
			return 0;
		}
        let index = this.utils.index_dammit(user);
        console.log("get_user_stamps for " + String(user)+ ", index=" + String(index));
        let stamps = 0.0; //Maybe readd nonzero predicate when seed users are figured out?
        stamps = this.utils.scores[index] * this.total_votes;
        console.log(stamps);
        console.log(this.utils.scores[index]);
		console.log(this.utils.scores);
        console.log(this.total_votes);
        return stamps;
    }

    load_votes_from_csv(filename="stamps.csv") {
        let rl = readLine.createInterface({
            input : f.createReadStream(file),
            output : process.stdout,
            terminal: false
        });
        let headerSkipped = false;
        rl.on('line', function (line) {
            if (! headerSkipped) {
                headerSkipped = true;
            } else {
                let line_contents = line.split(",");
                let msg_id =line_contents[0];
                let react_type = line_contents[1];
                let from_id = line_contents[2];
                let to_id = line_contents[3];
                this.update_vote(react_type, from_id, to_id, false, false);
            }
        });
        this.calculate_stamps();
    }



    static user_is_admin(username) {
        for(let i = 0; i < admin_usernames.length; i++) {
            if (username == admin_usernames[i]) {
                return true;
            }
            return false;
        }
    } 

}
 

module.exports = {
	
	getUservotes: async (req, res) => {
		const client = new MongoClient(database_path, { useNewUrlParser: true, useUnifiedTopology: true });
    //const employees = await Employees.find({});
	    await client.connect();
		const collection = client.db("Kelvin").collection("uservotes");
        const filteredDocs = await collection.find({}).toArray();
		console.log(filteredDocs);
		client.close();
		return res.json({data: filteredDocs});
    },
	
	getVotesByTransaction: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		
		let resultData = [];
		for (let i = 0; i < req.query.transactions.length; i++) {
			resultData.push(await stamps.utils.get_votes_by_transaction(req.query.transactions[i]));
		}
		return res.json({data: resultData});
	},
	
	updateVote: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		const success = await stamps.update_vote(req.query.stampType, req.query.fromId, req.query.fromName, req.query.toId, req.query.toTransaction); //req.query.negative is true in the case of a downvote, and false otherwise.
	    return res.json({data: success});
	},
	
	updateVoteForTransaction: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		const successSource = await stamps.update_vote(req.query.stampType, req.query.fromId, req.query.fromName, req.query.toIdSource, req.query.toTransaction);
	    const successDest = await stamps.update_vote(req.query.stampType, req.query.fromId, req.query.fromName, req.query.toIdDest, req.query.toTransaction);
	    return res.json({data: successSource && successDest});
	},
	
	getUserStamps: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		let resultData = await stamps.get_user_stamps(req.query.user);
		return res.json({data: resultData});
	},
	
	addNewTransaction: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		const successAdd = await stamps.utils.add_transaction(req.query.transactionId, req.query.amountSent, req.query.source, req.query.dest, req.query.description);
		const successSource = await stamps.update_vote("zerostamp", "placeholder_user", "placeholder_name", req.query.source, req.query.transactionId, false);
        const successDest = await stamps.update_vote("zerostamp", "placeholder_user", "placeholder_name", req.query.dest, req.query.transactionId, false);
        return res.json({data: successAdd && successSource && successDest});		
	},
	
	getTransactionPage: async (req, res) => {
		const stamps = new StampsModule();
		await stamps.init();
		let resultData = await stamps.utils.get_transaction_page(req.query.pageNumber);
		return res.json({data: resultData});
	}

};

