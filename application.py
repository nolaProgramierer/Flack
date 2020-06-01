import os
import requests

from flask import Flask, request, render_template, jsonify
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
