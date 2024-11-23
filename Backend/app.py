from flask import Flask, jsonify, request
from flask_cors import CORS
from quran_data import get_surah, get_ayah, get_translation_surah, get_translation_ayah
from user import login, signup, post_goals, post_progress, main
from database import create_user, get_user_by_id, get_goals_and_progress

import os

# Ensure the working directory is set correctly
print(os.getcwd())
os.chdir('/home/tahanafis2003/Documents/AL-Dhikr/Backend')

app = Flask(__name__)
CORS(app)

# Routes for Surah and Ayah data
@app.route('/surah/<int:surah_number>', methods=['GET'])
def get_surah_route(surah_number):
    """Returns all Ayahs for a given Surah."""
    return get_surah(surah_number)

@app.route('/translation/<string:lang>/<int:surah_number>', methods=['GET'])
def get_translation_surah_route(lang, surah_number):
    """Returns translations of all Ayahs for a given Surah in a specified language."""
    return get_translation_surah(lang, surah_number)

@app.route('/search_ayah/<int:surah_number>/<int:ayah_number>', methods=['GET'])
def get_ayah_route(surah_number, ayah_number):
    """Returns a specific Ayah from a given Surah."""
    return get_ayah(surah_number, ayah_number)

@app.route('/ayah_translation/<int:surah_number>/<int:ayah_number>', methods=['GET'])
def get_translation_ayah_route(surah_number, ayah_number):
    """Returns the translation of a specific Ayah."""
    return get_translation_ayah(surah_number, ayah_number)

# Routes for user authentication and management
@app.route('/login', methods=['POST'])
def login_route():
    return login()

@app.route('/signup', methods=['POST'])
def signup_route():
    return signup()

@app.route('/goals', methods=['POST'])
def post_goals_route():
    return post_goals()

@app.route('/progress', methods=['POST'])
def post_progress_route():
    return post_progress()

@app.route('/main', methods=['GET'])
def main_route():
    return main()

if __name__ == '__main__':
    app.run(debug=True)
