from flask import jsonify, request
from database import create_user, get_user_by_email, get_user_by_id, get_goals_and_progress, update_goals, set_goals, update_progress

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = get_user_by_email(email)

    if not user or user[2] != password:
        return jsonify({"error": "Invalid email or password"}), 401

    user_id = user[0]
    user_data = get_goals_and_progress(user_id)

    return jsonify({
        "message": "Login successful",
        "user_id": user_id,
        "ayahs_per_day": user_data[1] if user_data else 0,
        "minutes_per_day": user_data[2] if user_data else 0,
        "ayahs_read": user_data[3] if user_data else 0
    }), 200

def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = get_user_by_email(email)
    if existing_user:
        return jsonify({"error": "Email already in use"}), 409

    create_user(email, password)
    return jsonify({"message": "User created successfully"}), 201

def post_goals():
    data = request.get_json()
    user_id = data.get('user_id')
    ayahs_per_day = data.get('ayahs_per_day')
    minutes_per_day = data.get('minutes_per_day')

    if not user_id or not ayahs_per_day or not minutes_per_day:
        return jsonify({"error": "User ID, ayahs per day, and minutes per day are required"}), 400

    set_goals(user_id, ayahs_per_day, minutes_per_day)
    return jsonify({"message": "Goals set successfully"}), 201

def post_progress():
    data = request.get_json()
    user_id = data.get('user_id')
    ayahs_read = data.get('ayahs_read')

    if not user_id or ayahs_read is None:
        return jsonify({"error": "User ID and ayahs read are required"}), 400

    update_progress(user_id, ayahs_read)
    return jsonify({"message": "Progress updated successfully"}), 200

def main():
    return jsonify({"message": "Welcome to the Quran progress tracking system!"}), 200
