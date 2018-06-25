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
    cmd = 'rosbag record -a -O pcaps/' + fileName + '.bag &'
    os.system(cmd)