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

@socketio.on("select channel")
def selectChannel(data):
    selection = data["selection"]
    flack[selection] = []
    default_message = "{} channel".format(selection)
    name = data["name"]
    message_date = datetime.datetime.now()
    data = {"name": name, "message": default_message, "datetime": message_date}
    flack[selection].append(data)
    dict = json.dumps(flack)
    emit("announce ch selection", {"dict": dict, "channel": selection}, broadcast=True)

@socketio.on("submit message")
def message(data):
    channel = data["channel"]
    message = data["message"]
    name = data["name"]
    message_date = datetime.datetime.now()
    data = {"name": name, "message": message, "datetime": message_date}

    # If channel exists append data to existing channel array
    # Else add new dictionary to 'flack'
    key = channel
    if key in flack.keys():
        flack[channel].append(data)
    else:
        flack[channel] = []
        flack[channel].append(data)

    dict = json.dumps(flack)
    emit("announce message", {"dict": dict, "channel": channel}, broadcast=True)
