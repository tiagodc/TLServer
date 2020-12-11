import os, sys, time, re, subprocess as sp

os.environ.get('ROS_DISTRO')

class bashInfo:
    sudoPass = ''
    workDir = '.'
    baseCmd = 'echo {} | sudo -S '

    def setPass(self, psw):
        self.sudoPass = psw

    def setwd(self, wd):
        self.workDir = wd
        os.chdir(wd)

    def setBase(self):
        return self.baseCmd.format(self.sudoPass)

    def makeCmd(self, cmd):
        return self.setBase() + cmd

    def __init__(self):
        self.setBase()

cmdMaker = bashInfo()
cmdMaker.setPass('forlidar')

def getLidarDevice():
    devs = sp.run(['ifconfig'], stdout=sp.PIPE)
    devs = devs.stdout.decode('utf-8').split('\n\n')

    device = ''
    for i in devs:
        # isVlp = re.match(r'.*addr:192\.168\.1\.70.*', i, re.MULTILINE|re.DOTALL)
        isVlp = re.match(r'.*encap:Ethernet.*', i, re.MULTILINE|re.DOTALL)
        if isVlp is not None:
            device = i
            break
    
    if device == '':
        return device

    device = '-i ' + device.split(' ')[0]
    return device

device = getLidarDevice()
cmd = 'timeout 3 tcpdump ' + device + ' src 192.168.1.201 and port 8308'
cmd = cmdMaker.makeCmd(cmd)

a = sp.run(cmd, shell=True, stdout=sp.PIPE)
print(a.stdout)

# import rosbag, os, subprocess

# a = subprocess.run(['rosnode','list'], stdout=subprocess.PIPE)
# a = a.stdout.splitlines()

# [print(aa) for aa in a]

# cmd = 'rosnode kill ' + a[0].decode("utf-8")
# print(cmd)
# os.system(cmd)

# os.chdir(r'/home/tiago/Desktop/bag/')
# files = sorted(os.listdir())
# file = files[0] 

# bag = rosbag.Bag(file)

# for topic, msg, t in bag.read_messages():
#     # print(topic)
#     if(topic == '/velodyne_points'):
#         print(msg)

# bag.close()