
import Utilities from "./utilities";
const {Matrix, solve} = require('ml-matrix'); //npm install this

class StampsModule {
    toString() {
        return "Stamps module";
    }

    constructor() {
        this.utils = Utilities.get_instance();
        this.red_stamp_value = 1;
        this.gold_stamp_value = this.red_stamp_value * 5;
        this.user_karma = 1.0;
        this.total_votes = this.utils.get_total_votes();
        this.calculate_stamps();
    }

    reset_stamps() {
        console.log("WIPING STAMP RECORDS");
        this.utils.clear_votes()
        this.utils.update_vote(god_id, rob_id); //Generate start set IDs and replace these
    }

    update_vote(stamp_type, from_id, to_id, negative=false, recalculate=true){
        if (to_id == stampy_id) {
            //votes for stampy do nothing
            return;
        }
        if(to_id == from_id) {
            //votes for yourself do nothing
            return;
        }

        let vote_strength = 0;

        if (stamp_type == "stamp") {
            vote_strength = this.red_stamp_value;
        } else if (stamp_type == "goldstamp") {
            vote_strength = this.gold_stamp_value;
        }

        if (negative) {
            vote_strength = -vote_strength;
        }

        this.total_votes += vote_strength;
        this.utils.update_vote(from_id, to_id, vote_strength);
        this.utils.users = this.utils.get_users();
        this.utils.update_ids_list();
        if (recalculate) {
            this.calculate_stamps();
        }

    }

    calculate_stamps() {
        //set up and solve the system of linear equations
        console.log("RECALCULATING STAMP SCORES");

        this.utils.users = this.utils.get_users();
        this.users.update_ids_list();

        let user_count = this.utils.users.length;

        let users_matrix = Matrix.zeros(user_count, user_count);

        let votes = this.utils.get_all_user_votes();
        console.log(votes);

        for(let i = 0; i < votes.length; i++) {
            let from_id = votes[i][0]; //This may change depending on the database implementation and what objects returned from the database look like
            let to_id = votes[i][1];
            let votes_for_user = votes[i][2];
            let from_id_index = this.utils.index[from_id];
            let toi = this.utils.index[to_id];
            let total_votes_by_user = this.utils.get_votes_by_user(from_id);
            if (total_votes_by_user != 0) {
                score = (this.user_karma * votes_for_user) / total_votes_by_user;
                users_matrix.set(toi, from_id_index, score); 
            }

        }

        for (let i = 1; i < user_count; i++) {
            users_matrix.set(i, i, -1.0);
        }

        users_matrix.set(0, 0, 1.0);

        user_count_matrix = Matrix.zeros(user_count, 1);
        user_count_matrix.set(0, 0, 1.0); //God has 1 karma

        this.utils.scores = solve(users_matrix, user_count_matrix);

        this.print_all_scores();

    }
}