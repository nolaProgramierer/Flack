import os
import requests
import datetime

from flask import Flask, request, render_template, jsonify, json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

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
    emit("announce ch selection", {"selection": selection}, broadcast=True)

@socketio.on("submit message")
def message(data):
    channel = data["channel"]
    message = data["message"]
    name = data["name"]
    message_date = datetime.datetime.now()
    data = {channel: [{"name": name, "message": message, "datetime": message_date}]}
    dict = json.dumps({"flack" : data})
    emit("announce message", {"dict": dict}, broadcast=True)
