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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
    # app.run(port=5001, host='0.0.0.0', debug=False)
