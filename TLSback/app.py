from flask import Flask, request, send_from_directory, render_template #import main Flask class and request object
import json, main, os, rosdefs, sys
from flask_cors import CORS
from flask_socketio import SocketIO
import datetime

app = Flask(__name__) #create the Flask app
CORS(app)
socketio = SocketIO(app)

today_date_string = datetime.datetime.today().strftime(r'%Y%m%d')

@socketio.on('disconnect')
def app_left():
    main.stopPcap()
    print('left...')

@app.route('/sensor', methods=['GET'])
def which_sensor():
    return json.dumps(main.getSensor())

@app.route('/check', methods=['GET'])
def check():
    testName = '__pcap__'
    testFile = main.getPcap(testName)    
    if(testFile != False):
        cmd = 'rm --interactive=never pcaps/' + testName + '.pcap'
        cmd = main.cmdMaker.makeCmd(cmd)
        os.system(cmd)
        testFile = True
    return json.dumps(testFile)

@app.route('/create', methods=['POST', 'GET'])
def create():
    obj = request.get_json()

    global today_date_string
    fileName = obj['name'] + '_' + today_date_string

    hasFile = main.getPcap(fileName)
    if(type(hasFile) is int):
        rosdefs.record(fileName)
    return json.dumps(hasFile)

@app.route('/dir', methods=['GET'])
def dir():
    files = main.listPcaps()
    return json.dumps( files )

@app.route('/monitor', methods=['POST', 'GET'])
def monitor():
    obj = request.get_json()

    global today_date_string
    fullName = 'pcaps/' + obj['name'] + '_' + today_date_string + '.pcap'
    
    size = main.checkPcap(fullName)
    return json.dumps( size )

@app.route('/kill', methods=['GET'])
def kill():
    path = main.stopPcap()
    rosdefs.kill()
    return json.dumps(path)

@app.route('/check_drive', methods=['GET'])
def checkDrive():
    return json.dumps( main.checkFlashDrive() )

@app.route('/check_pc', methods=['GET'])
def pcInfo():
    return json.dumps( 
        {
            'storage': main.getHardDriveStorage(),
            'files': main.getUntransferedFiles() 
            # 'battery': main.getBatteryLife()
        }
    )

@app.route('/list_files', methods=['GET'])
def listFiles():
    flash = main.getFlashPath()
    
    if flash == False:
        return json.dumps('nousb')

    fl = main.listDiskFiles('pcaps')
    dest = main.makeDirTree(flash) if len(fl) > 0 else False

    return json.dumps( {'files': fl, 'destination': dest} )

@app.route('/transfer_file', methods=['POST'])
def transferFile():
    obj = request.get_json()
    remSpace = main.checkFlashDrive()
    remSpace = 1000 * remSpace
    
    msg = 'full' if remSpace < obj['size'] else 'next'

    if msg == 'next':
        track = main.moveSingleFile(obj['path'], obj['destination'])
        if track == 0: 
            main.removeSingleFile(obj['path'])
        else:
            main.removeUnfinishedFile(obj['path'], obj['destination'])
            msg = 'stop'
    
    return json.dumps(msg)

@app.route('/delete_file', methods=['POST'])
def deleteFile():
    obj = request.get_json() 
    main.removeSingleFile(obj['path'])        
    return json.dumps(None)

@app.route('/kill_transfer', methods=['GET'])
def killTransfer():
    main.killTransfer()
    return json.dumps(True)

@app.route('/make_dir', methods=['GET'])
def makeDir():
    folder = 'pcaps'
    if not os.path.exists(folder) or not os.path.isdir(folder):
        os.mkdir(folder)
        return json.dumps(True)
    return json.dumps(False)

@app.route('/check_file', methods=['POST'])
def checkFile():
    obj = request.get_json()

    global today_date_string
    today_date_string = datetime.datetime.today().strftime(r'%Y%m%d')

    fileName = obj['name'] + '_' + today_date_string

    path = 'pcaps/' + fileName + '.pcap'
    exists = main.checkFileOnDisk(path)
    return json.dumps(exists)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    sudo = main.cmdMaker.makeCmd('shutdown now -P -f')
    os.system(sudo)
    return json.dumps(True)

@app.route('/sensor_monitor', methods=['GET'])
def sensor_monitor():
    job = main.monitor(3)
    
    gps = job.gps()
    imu = job.imu()
    laser_pcap = job.laser()
    laser_bag = job.laser(True)

    minLen = 100
    obj = {'gps': gps > minLen, 'imu': imu > minLen, 'laser_pcap': laser_pcap > minLen, 'laser_bag': laser_bag > minLen}
    return json.dumps(obj)

if __name__ == '__main__':
    # os.environ['LIDAR_SENSOR'] = sys.argv[1]
    socketio.run(app, host='0.0.0.0', port=5001, debug=False)
    # app.run(port=5001, host='0.0.0.0', debug=False)
