from flask import Flask, request, send_from_directory, render_template #import main Flask class and request object
import json, main, os, rosdefs
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__) #create the Flask app
CORS(app)
socketio = SocketIO(app)

@socketio.on('disconnect')
def app_left():
    main.stopPcap()
    print('left...')

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
    hasFile = main.getPcap(obj['name'])
    if(type(hasFile) is int):
        rosdefs.record(obj['name'])

    return json.dumps(hasFile)

@app.route('/dir', methods=['GET'])
def dir():
    files = main.listPcaps()
    return json.dumps( files )

@app.route('/monitor', methods=['POST', 'GET'])
def monitor():
    obj = request.get_json()
    fullName = 'pcaps/' + obj['name'] + '.pcap'
    size = main.checkPcap(fullName)
    return json.dumps( size )

@app.route('/kill', methods=['GET'])
def kill():
    path = main.stopPcap()
    rosdefs.kill()
    return json.dumps(path)

@app.route('/download/<path:filename>', methods=['GET','POST'])
def download(filename):
    path = os.getcwd() + '/pcaps'
    if not os.path.exists(path) and not os.path.isdir(path):
        os.mkdir(path)
    # main.flashSave(filename)
    return send_from_directory(path, filename)

@app.route('/save', methods=['GET','POST'])
def save():
    obj = request.get_json()
    fileName = obj['name']
    return json.dumps( main.flashSave(fileName + '.*') )

@app.route('/check_drive', methods=['GET'])
def checkDrive():
    return json.dumps( main.checkFlashDrive() )

@app.route('/check_pc', methods=['GET'])
def pcInfo():
    return json.dumps( 
        {
            'storage': main.getHardDriveStorage(), 
            'battery': main.getBatteryLife()
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
    remSpace = main.getHardDriveStorage()
    remSpace = 1000 * remSpace['available']

    msg = 'full' if remSpace < obj['size'] else 'next'
    
    if msg == 'next':
        main.moveSingleFile(obj['path'], obj['destination'])
    
    return json.dumps(msg)

@app.route('/kill_transfer', methods=['GET'])
def killTransfer():
    main.killTransfer()
    return json.dumps(True)

@app.route('/make_dir', methods=['GET'])
def makeDir():
    folder = 'pcaps'
    if not os.path.exists(folder) or not os.path.isdir(folder):
        os.mkdir(folder)
    return json.dumps(0)

@app.route('/check_file', methods=['POST'])
def checkFile():
    obj = request.get_json()
    path = 'pcaps/' + obj['name'] + '.pcap'
    exists = main.checkFileOnDisk(path)
    return json.dumps(exists)

@app.route('/shutdown', methods=['GET'])
def shutdown():
    sudo = main.cmdMaker.makeCmd('shutdown now -P -f')
    os.system(sudo)
    return json.dumps(True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=False)
    # app.run(port=5001, host='0.0.0.0', debug=False)
