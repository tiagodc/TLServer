#!/usr/bin/python3

import os, re, subprocess as sp
from main import getSensor

def kill():
    nodes = sp.run(['rosnode','list'], stdout=sp.PIPE)
    nodes = [i.decode('utf-8') for i in nodes.stdout.splitlines()]
    
    for i in nodes:
        isBag = re.match(r'/record_*', i, re.IGNORECASE)
        if isBag is not None:
            cmd = 'rosnode kill ' + i
            os.system(cmd)

def record(fileName):
    topics = ''
    if getSensor() == 'VLP16':
        # topics = "/velodyne_points /imu_data /ekf_quat /ekf_euler /diagnostics /mag /gps_dump"
        topics = "/velodyne_points /gps_dump"
    elif getSensor() == 'OS1':
        topics = "/os1_cloud_node/points /os1_cloud_node/imu"   
        
    cmd = r'rosbag record --bz2 -O "pcaps/' + fileName.encode('utf-8').decode('utf-8') + r'.bag" ' + topics + ' &'
    os.system(cmd)
