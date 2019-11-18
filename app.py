import json
import random
import time
from datetime import datetime
import requests

from flask import Flask, Response, render_template

application = Flask(__name__)
random.seed()  # Initialize the random number generator

flag = False
prev_time = None
request = []
cpu = []
disk = []
swap = []
vmemory = []
res = {}
pipeline_ip = "172.17.49.171"
pipeline_port = "5002"
path = "/stream"

@application.route('/')
@application.route('/dashboard')
def index():
    return render_template('index.html')


def dashboard():
    return render_template('dashboard.html')


@application.route('/chart-data')
def chart_data():
    def generate_random_data():
        while True:    
            with requests.get("http://" + pipeline_ip + ":" + pipeline_port + path, stream=True) as res:
                for line in res.iter_lines():
                    if line and len(line) > 1:
                        data = line.decode("utf-8")
                        print(data)
                        data = data.split("::")
                        res_data = process_data(data)
                        print(res_data)
                        if res_data['status'] == 'new':
                            json_data = json.dumps(
                                {'time': res_data['timestamp'], 
                                'value': res_data['num_request'], 
                                'value2': res_data['avg_cpu'],
                                'value3': res_data['avg_disk'],
                                'value4': res_data['avg_vmemory'],
                                })
                        
                            # json_data = json.dumps(
                            #     {'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'value': random.random() * 100})
                            yield f"data:{json_data}\n\n"

    return Response(generate_random_data(), mimetype='text/event-stream')


def process_data(data):
    global flag
    global prev_time
    global request
    global cpu
    global disk
    global vmemory
    global res

    curr_time = data[0].split(',')[0]
    fmt = "%Y-%m-%d %H:%M:%S"

    if flag == True:
        tdelta = datetime.strptime(prev_time, fmt) - datetime.strptime(curr_time, fmt)
        print(curr_time, prev_time)
        if tdelta.seconds > 0:
            print("New Second !")
            avg_cpu = sum(cpu)/len(cpu)
            avg_disk = sum(disk)/len(disk)
            avg_vmemory = sum(vmemory)/len(vmemory)
            res['num_request'] = len(cpu)
            res['avg_cpu'] = avg_cpu
            res['avg_disk'] = avg_disk
            res['avg_vmemory'] = avg_vmemory
            res['timestamp'] = prev_time
            res['status'] = 'new'
            # request = []
            cpu = []
            disk = []
            vmemory = []
        else:
            res['status'] = 'repeat'
        cpu.append(float(data[6]))
        disk.append(float(data[7]))
        vmemory.append(float(data[9]))
        prev_time = curr_time
        return res
    else:
        cpu.append(float(data[6]))
        disk.append(float(data[7]))
        vmemory.append(float(data[9]))
        flag = True
        prev_time = curr_time



if __name__ == '__main__':
    application.run(debug=True, threaded=True)