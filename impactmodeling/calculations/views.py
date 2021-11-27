from django.http import HttpResponse
from cadCAD.configuration import Experiment
from cadCAD.engine import ExecutionMode, ExecutionContext, Executor
from scipy.stats import norm
import numpy as np
from impactmodeling.utils import db
from django.views.decorators.csrf import csrf_exempt


TOTAL_RANDOM_SAMPLES = 100000

def index(request):
    return HttpResponse("Hello, world. You're at the calculations index.")

@csrf_exempt
def model(request):


    user = request.POST.get("user")
    proposal_id = request.POST.get("proposal_id")
    param1 = db.variables.find_one({"name": request.POST.get("param1"), "user": user, "proposalId": proposal_id})
    operator = request.POST.get("operator")
    param2 = db.variables.find_one({"name": request.POST.get("param2"), "user": user, "proposalId": proposal_id})
    collection = request.POST.get("collection")

    def get_variable(varname):
        return db.variables.find_one({"name": varname, "user": user, "proposalId": proposal_id})

    def percolate_variable(left, op, right):
        if left[u'type'] == u'composite':
            return percolate_variable(percolate_variable(get_variable(left[u'param1']), left[u'operator'], get_variable(left[u'param2'])), op, right)
        elif right[u'type'] == u'composite':
            return percolate_variable(left, op, percolate_variable(get_variable(right[u'param1']), right[u'operator'], get_variable(right[u'param2'])))
        else:
            leftVal = left[u'value']
            rightVal = right[u'value']
            if isinstance(leftVal, str) and leftVal.__contains__(","):
                leftVal = leftVal.split(",")
            if isinstance(rightVal, str) and rightVal.__contains__(","):
                rightVal = rightVal.split(",")
        loc1 = None
        loc2 = None
        scale1 = None
        scale2 = None

        if isinstance(leftVal, list):
            loc1, scale1 = generate_mean_stddev(leftVal[0], leftVal[1])
        if isinstance(rightVal, list):
            loc2, scale2 = generate_mean_stddev(rightVal[0], rightVal[1])

        exp = Experiment()

        def take_a_sample(_params, substep, sH, s, _input, **kwargs):
            current_avg = s["average_result"]
            leftValue = float(leftVal) if loc1 == None else norm.rvs(loc=loc1, scale=scale1)
            rightValue = float(rightVal) if loc2 == None else norm.rvs(loc=loc2, scale=scale2)
            if op == "+":
                current_avg += (leftValue + rightValue) / TOTAL_RANDOM_SAMPLES
            elif op == "-":
                current_avg += (leftValue - rightValue) / TOTAL_RANDOM_SAMPLES
            elif op == "*":
                current_avg += (leftValue * rightValue) / TOTAL_RANDOM_SAMPLES
            elif op == "/":
                current_avg += (leftValue / rightValue) / TOTAL_RANDOM_SAMPLES
            return "average_result", current_avg

        init_state = {
            "average_result": 0
        }

        lists_of_samples = [None, None]

        PSUBs = [{"policies": {}, "variables": {"s_1": take_a_sample}}]

        exp.append_model(initial_state=init_state, partial_state_update_blocks=PSUBs, policy_ops=[lambda _: None],
                         sim_configs=[{'N': 1, 'T': range(TOTAL_RANDOM_SAMPLES), 'M': []}])

        exec_mode = ExecutionMode()
        local_mode_ctx = ExecutionContext(context=exec_mode.local_mode)
        simulation = Executor(exec_context=local_mode_ctx, configs=exp.configs)
        raw_system_events, tensor_field, sessions = simulation.execute()
        final_result = raw_system_events[len(raw_system_events) - 1]['average_result']
        return {u'type': u'result', u'value': final_result}

    def generate_mean_stddev(lower_bound, upper_bound):
        lower_bound = float(lower_bound)
        upper_bound = float(upper_bound)
        mean = lower_bound + ((upper_bound - lower_bound)/2.0)
        stddev = np.sqrt(TOTAL_RANDOM_SAMPLES) * (upper_bound - lower_bound)/3.29
        return mean, stddev

    finalScore = percolate_variable(param1, operator, param2)

    db.models.update_one({"user": user, "proposalId": proposal_id, "collection": collection}, {"$set": {"user": user, "proposalId": proposal_id, "score": finalScore, "collection": collection}}, True)

    return HttpResponse(user + " gave " + proposal_id + " a score of " + str(finalScore[u'value']))

@csrf_exempt
def variable(request):
    user = request.POST.get("user")
    proposal_id = request.POST.get("proposal_id")
    name = request.POST.get("name")
    type = request.POST.get("type")
    if (type == "number" or type == "distribution"):
        value = request.POST.get("value")
        db.variables.update_one({"user": user, "proposalId": proposal_id, "name": name}, {"$set": {"user": user, "proposalId": proposal_id, "name": name, "type": type, "value": value}}, True)
    elif type == "composite":
        operator = request.POST.get("operator")
        param1 = request.POST.get("param1")
        param2 = request.POST.get("param2")
        db.variables.update_one({"user": user, "proposalId": proposal_id, "name": name}, {"$set": {"user": user, "proposalId": proposal_id, "name": name, "type": type, "param1": param1, "operator": operator, "param2": param2}}, True)
    return HttpResponse(user + " created variable " + name)