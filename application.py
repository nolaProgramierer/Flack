import os
import requests
import datetime

from flask import Flask, request, render_template, jsonify, json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

flack = {"General": [{"name": "admin", "message": "Messages for admin", "datetime": ""}]}

@app.route("/")
def index():
    return render_template("/index.html")

@socketio.on("submit channel")
def channel(data):
    channel = data["channel"]
    emit("announce channel", {"channel": channel}, broadcast=True)

@socketio.on("channel selection")
def sendChannel(data):
    channel = data["selection"]
    emit("send channel message", {"channel": channel})

@socketio.on("submit message")
def message(data):
    channel = data["channel"]
    message = data["message"]
    name = data["name"]
    message_date = datetime.datetime.now()
    data = {"name": name, "message": message, "datetime": message_date}
    if not channel in flack :
        flack[channel] = []
        flack[channel].append(data)
    else:
        flack[channel].append(data)
    dict = json.dumps(flack)
    emit("announce message", {"channel": channel, "dict": dict}, broadcast=True)
