#!/usr/bin/python3

import os, sys, time, re, subprocess as sp

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
# cmdMaker.setwd('/home/tiago/Desktop/TLServer/')

def getSensor():
    return os.environ.get('LIDAR_SENSOR')

class monitor:
    timeout = 3

    def gps(self):
        if getSensor() == 'OS1':
            return 0
        device = getLidarDevice()
        cmd = self.timeout + 'tcpdump ' + device + ' src 192.168.1.201 and port 8308'
        cmd = cmdMaker.makeCmd(cmd)
        out = sp.run(cmd, shell=True, stdout=sp.PIPE)
        out = str(out.stdout)
        return len(out)
    
    def imu(self):
        if getSensor() == 'VLP16':
            topic = '/imu_data'
            return 0
        elif getSensor() == 'OS1':
            topic = '/os1_cloud_node/imu'

        cmd = self.timeout + 'rostopic echo ' + topic
        out = sp.run(cmd, shell=True, stdout=sp.PIPE)
        out = str(out.stdout)
        return len(out)

    def laser(self, ros=False):
        if getSensor() == 'VLP16':
            topic = '/velodyne_points'
            ip = '192.168.1.201'
            port = '2368'
        elif getSensor() == 'OS1':
            topic = '/os1_cloud_node/points'
            ip = 'os1-122021000143.local'
            port = '10001'

        if ros:
            cmd = self.timeout + 'rostopic echo ' + topic
        else:
            device = getLidarDevice()
            cmd = self.timeout + 'tcpdump ' + device + ' src ' + ip + ' and port ' + port
            cmd = cmdMaker.makeCmd(cmd)

        out = sp.run(cmd, shell=True, stdout=sp.PIPE)
        out = str(out.stdout)
        return len(out)
    
    def __init__(self, tm=3):
        self.timeout = 'timeout ' + str(tm) + ' '

def checkPcap(fullFileName, erase=False):
    fullFileName = fullFileName.encode('utf-8').decode('utf-8')

    sz1 = os.path.getsize( fullFileName )    
    time.sleep(2)
    sz2 = os.path.getsize( fullFileName )

    if(sz2 == sz1):
        cmd = 'kill -9 $(pidof tcpdump)'
        if(erase): cmd +=  ' && rm --interactive=never "' + fullFileName + '"'
        cmd = cmdMaker.makeCmd(cmd)
        os.system( cmd )
        return False
    else:
        return sz2

def getLidarDevice():
    devs = sp.run(['ifconfig'], stdout=sp.PIPE)
    devs = devs.stdout.decode('utf-8').split('\n\n')   

    device = ''
    for i in devs:
        isVlp = re.match(r'.*encap:Ethernet.*addr:192\.168\.1\.70.*', i, re.MULTILINE|re.DOTALL)
        isOs1 = re.match(r'.*encap:Ethernet.*addr:10\.5\.5\.1.*', i, re.MULTILINE|re.DOTALL)
        if isVlp is not None or isOs1 is not None:
            device = i
            break
    
    if device == '':
        return device

    device = '-i ' + device.split(' ')[0]
    return device

def getPcap(fileName):

    if getSensor() == 'VLP16':
        ip = '192.168.1.201'
        port1 = '2368'
        port2 = '8308'
        port_cmd = 'and port {} or port {}'.format(port1, port2)
    elif getSensor() == 'OS1':
        ip = 'os1-122021000143.local'
        port1 = '10001'
        port2 = '10002'
        port_cmd = ''
    
    fileName = fileName.encode('utf-8').decode('utf-8')  
    device = getLidarDevice()    

    cmd = 'tcpdump ' + device + ' src {} {} -w "pcaps/'.format(ip,port_cmd) + fileName + '.pcap" &'
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
    userName  = os.listdir('/media/')

    if(len(userName) == 0):
        return False
    else:
        userName = userName[0]

    fList = os.listdir('/media/' + userName)
    for i in fList:
        isSys = re.match(r'settings\d*', i, re.IGNORECASE)
        if isSys == None:
            flashPath = '/media/' + userName + '/' + i + '/'
            return flashPath.encode('utf-8').decode('utf-8')

    return False

def checkFlashDrive():
    disk  = getFlashPath()
    if not disk:
        return False
    
    disk = os.statvfs(disk)
    space = disk.f_bfree * disk.f_bsize / 1024 / 1024 / 1024
    return space

# def flashSave(fullFileName, backGround = False):
#     check = checkFlashDrive()
#     if not(check):
#         return False

#     flashPath = getFlashPath()
#     cmd = 'mkdir ' + flashPath + 'pcaps -p'
#     cmd = cmdMaker.makeCmd(cmd)
#     os.system(cmd)

#     cmd = 'mv pcaps/' + fullFileName + ' ' + flashPath + 'pcaps/' #+ fullFileName
#     if(backGround): cmd += ' &'
#     cmd = cmdMaker.makeCmd(cmd)
#     os.system(cmd)

#     return checkFlashDrive()

# def checkFileName(fullFileName):
#     drive = checkFlashDrive()
#     if not(drive):
#         return 'No flash drive detected.'
    
#     flashPath = getFlashPath()

#     if not( os.path.exists(flashPath) ):
#         return False

#     files = os.listdir(flashPath)
#     if(fullFileName in files):
#         return True
#     else:
#         return False

def getHardDriveStorage():
    disks = sp.run(['df'], stdout=sp.PIPE)
    
    for i in disks.stdout.decode('utf-8').split('\n'):
        if re.match(r'.+\s/$', i) is not None:
            j = re.compile(r'\s+').split(i)
            spc = float(j[3]) / 1024**2
            prc = j[4]
    
    return {'available': spc, 'used': prc}

# def getBatteryLife():
#     acpi = sp.run(['acpi'], stdout=sp.PIPE)
#     acpi = acpi.stdout.decode('utf-8')

#     items = re.compile(r'\s+').split(acpi)

#     if len(items) > 5:
#         prc = items[3][0:-1]
#         tm = items[4][0:-3].replace(':','h ') + 'min'
#     else:
#         prc = items[3]
#         tm = 'carregando'

#     return {'percentage': prc, 'time': tm}

def moveFiles(inDir, outDir, nameDir='bp_forlidar'):
    
    oPath = outDir + '/' + nameDir
    counter = 0
    dirOpen = True

    while dirOpen:
        nPath = oPath + str(counter)
        if os.path.exists(nPath) and os.path.isdir(nPath):
            counter += 1
        else:
            os.mkdir(nPath)
            dirOpen = False
    
    if inDir == '':
        inDir = '.'

    cmd = 'mv {}/* {}/'.format(inDir, oPath)
    cmd = cmdMaker.makeCmd(cmd)
    
    os.system(cmd)

def checkFileOnDisk(filePath):
    
    return os.path.exists( filePath.encode('utf-8').decode('utf-8') )

def listDiskFiles(path = '.'):
    
    files = os.listdir(path)
    dataFiles = []

    for i in files:
        isBag  = re.match(r'.+\.bag$', i)
        isPcap = re.match(r'.+\.pcap$', i)

        if isBag is not None or isPcap is not None:
            fullPath = path + '/' + i
            fullPath = fullPath.encode('utf-8').decode('utf-8')
            size = os.path.getsize(fullPath) / 1000000
            dataFiles.append({'path': fullPath, 'size': size})
    
    return dataFiles

def moveSingleFile(filePath, outPath):
    mv = 'cp "{}" "{}"'.format(filePath, outPath).encode('utf-8').decode('utf-8')
    mv = cmdMaker.makeCmd(mv)
    return os.system(mv)

def removeSingleFile(filePath):
    rm = 'rm "{}"'.format(filePath).encode('utf-8').decode('utf-8')
    rm = cmdMaker.makeCmd(rm)
    os.system(rm)

def removeUnfinishedFile(filePath, outPath):
    unfinished = re.sub('^pcaps/', outPath + '/', filePath)
    rm = 'rm "{}"'.format(unfinished).encode('utf-8').decode('utf-8')
    rm = cmdMaker.makeCmd(rm)
    os.system(rm)

def makeDirTree(flashPath, mainDir = 'bp_forlidar', subDir = 'trsf'):
    dirPath = flashPath + '/' + mainDir

    if not os.path.exists(dirPath):
        os.mkdir(dirPath)
    
    subPath = dirPath + '/' + subDir
    index = 0
    dirMissing = True

    while dirMissing:
        tempPath = subPath + str(index)
        if os.path.exists(tempPath):
            index += 1
        else:
            os.mkdir(tempPath)
            dirMissing = False

    return tempPath

def killTransfer():
    cmd = 'killall -9 cp'
    cmd = cmdMaker.makeCmd(cmd)
    os.system(cmd)

def getUntransferedFiles():
    return len(listPcaps())
