#!/usr/bin/python3

import os, sys, time

class bashInfo:
    sudoPass = 'tdc12237514'
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
# cmdMaker.setwd('/home/tiago/Desktop/TLServer/')

def checkPcap(fullFileName, erase=False):
    sz1 = os.path.getsize( fullFileName )
    
    time.sleep(2)
    sz2 = os.path.getsize( fullFileName )

    if(sz2 == sz1):
        cmd = 'kill -9 $(pidof tcpdump)'
        if(erase): cmd +=  ' && rm --interactive=never ' + fullFileName
        cmd = cmdMaker.makeCmd(cmd)
        os.system( cmd )
        return False
    else:
        return sz2

def getPcap(fileName):
    cmd = 'tcpdump src 192.168.1.201 and port 2368 or port 8308 -w pcaps/' + fileName + '.pcap &'
    cmd = cmdMaker.makeCmd(cmd)
    os.system(cmd)

    time.sleep(2)
    return checkPcap('pcaps/' + fileName + '.pcap', True)

def stopPcap():
    cmd = 'kill -9 $(pidof tcpdump)'
    cmd = cmdMaker.makeCmd(cmd)
    os.system( cmd )
    return True

def listPcaps():
    return os.listdir('pcaps')