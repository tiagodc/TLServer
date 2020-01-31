#!/usr/bin/python3

import os, re, subprocess as sp

def kill():
    nodes = sp.run(['rosnode','list'], stdout=sp.PIPE)
    nodes = [i.decode('utf-8') for i in nodes.stdout.splitlines()]
    
    for i in nodes:
        isBag = re.match(r'/record_*', i, re.IGNORECASE)
        if isBag is not None:
            cmd = 'rosnode kill ' + i
            os.system(cmd)

def record(fileName):
    cmd = r'rosbag record -O "pcaps/' + fileName.encode('utf-8') + r'.bag" /velodyne_points /imu_data /ekf_quat /ekf_euler /diagnostics /mag /gps_dump &'
    os.system(cmd)
