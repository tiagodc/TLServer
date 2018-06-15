from flask import Flask, request, send_from_directory, render_template #import main Flask class and request object
import json, main, os
from flask_cors import CORS

app = Flask(__name__) #create the Flask app
CORS(app)

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
    return json.dumps(path)

@app.route('/download/<path:filename>', methods=['GET','POST'])
def download(filename):
    path = os.getcwd() + '/pcaps'
    return send_from_directory(path, filename)

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=False)