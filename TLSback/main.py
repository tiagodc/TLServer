#!/usr/bin/python3

import os, sys, time, re

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
cmdMaker.setPass('ubuntu')
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

    exists = checkFileName(fileName + '.pcap')
    if(exists and type(exists) is bool):
        return 'Name already taken.'

    device = 'enxb827eb666ac6'
    cmd = 'tcpdump -i ' + device + ' src 192.168.1.201 and port 2368 or port 8308 -w pcaps/' + fileName + '.pcap &'
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

def getFlashPath():
    userName  = os.listdir('/media/')[0]
    fList = os.listdir('/media/' + userName)
    for i in fList:
        isSys = re.match(r'settings\d*', i, re.IGNORECASE)
        if isSys == None:
            flashPath = '/media/' + userName + '/' + i + '/'
            return flashPath
    return False

def checkFlashDrive():
    disk  = getFlashPath()
    if not disk:
        return False
    
    disk = os.statvfs(disk)
    space = disk.f_bfree * disk.f_bsize / 1000 / 1000 / 1000
    return space

def flashSave(fullFileName, backGround = False):
    check = checkFlashDrive()
    if not(check):
        return False

    flashPath = getFlashPath()
    cmd = 'mkdir ' + flashPath + 'pcaps -p'
    cmd = cmdMaker.makeCmd(cmd)
    os.system(cmd)

    cmd = 'cp pcaps/' + fullFileName + ' ' + flashPath + 'pcaps/' + fullFileName
    if(backGround): cmd += ' &'
    cmd = cmdMaker.makeCmd(cmd)
    os.system(cmd)

    return checkFlashDrive()

def checkFileName(fullFileName):
    drive = checkFlashDrive()
    if not(drive):
        return 'No flash drive detected.'
    
    flashPath = getFlashPath()

    if not( os.path.exists(flashPath) ):
        return False

    files = os.listdir(flashPath)
    if(fullFileName in files):
        return True
    else:
        return False
