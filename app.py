import json
import random
import time
from datetime import datetime
import requests

from flask import Flask, Response, render_template

application = Flask(__name__)
random.seed()  # Initialize the random number generator


@application.route('/')
@application.route('/memory')
@application.route('/cpu')
def index():
    return render_template('index.html')


@application.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

flag = False
prev_time = None
val1 = []
res = {}

@application.route('/chart-data')
def chart_data():
    def generate_random_data():
        global flag

        while True:    
            with requests.get("http://172.17.49.171:5002/stream", stream=True) as res:
                for line in res.iter_lines():
                    if line and len(line) > 1:
                        # counter = 0
                        data = line.decode("utf-8")
                        print(data)
                        # print(len(line))
                        # counter = counter + 1
                        # print("---------------------->" + str(counter))
                        data = data.split("::")
                        res_data = process_data(data)
                        print(res_data)
                        if res_data['status'] == 'new':
                            json_data = json.dumps(
                                {'time': res_data['timestamp'], 
                                'value': res_data['num_request'], 
                                'value2': res_data['avg_val1'],
                                'value3': res_data['avg_val1'],
                                'value4': res_data['num_request'],
                                })
                        
                            # json_data = json.dumps(
                            #     {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': random.random() * 100})
                            yield f"data:{json_data}\n\n"
                        # time.sleep(1)

    return Response(generate_random_data(), mimetype='text/event-stream')


def process_data(data):
    global flag
    global prev_time
    global val1
    global res

    curr_time = data[0].split(',')[0]
    fmt = "%Y-%m-%d %H:%M:%S"

    if flag == True:
        # do something
        tdelta = datetime.strptime(prev_time, fmt) - datetime.strptime(curr_time, fmt)
        print(curr_time, prev_time)
        if tdelta.seconds > 0:
            print("New Second !")
            val1_avg = sum(val1)/len(val1)
            print("Avg value -->" + str(val1_avg))
            res['num_request'] = len(val1)
            res['timestamp'] = prev_time
            res['avg_val1'] = val1_avg
            res['status'] = 'new'
            val1 = []
        else:
            res['status'] = 'repeat'
        val1.append(float(data[-1]))
        prev_time = curr_time
        return res
        # print("------------------")
        # print(val1)
        # print("------------------")
    else:
        val1.append(float(data[-1]))
        flag = True
        prev_time = curr_time



if __name__ == '__main__':
    application.run(debug=True, threaded=True)