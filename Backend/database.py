import sqlite3

def create_user(email, password):
    db_path = '/home/tahanafis2003/Documents/AL-Dhikr/Backend/progress.db'  # Update to full path if necessary
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
    conn.commit()
    conn.close()

def get_user_by_email(email):
    conn = sqlite3.connect('progress.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email=?", (email,))
    user = cursor.fetchone()
    conn.close()
    return user

def get_user_by_id(user_id):
    conn = sqlite3.connect('progress.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id=?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

def get_goals_and_progress(user_id):
    db_path = '/home/tahanafis2003/Documents/AL-Dhikr/Backend/progress.db'  # Update to full path if necessary
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT g.id, g.ayahs_per_day, g.minutes_per_day, p.ayahs_read 
        FROM goals g
        JOIN progress p ON g.id = p.user_id
        WHERE p.user_id = ?
        ORDER BY g.id DESC LIMIT 1
    """, (user_id,))
    result = cursor.fetchone()
    conn.close()
    return result

def update_goals(user_id, ayahs_per_day, minutes_per_day):
    db_path = '/home/tahanafis2003/Documents/AL-Dhikr/Backend/progress.db'  # Update to full path if necessary
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE goals
        SET ayahs_per_day = ?, minutes_per_day = ?
        WHERE id = (SELECT id FROM goals WHERE user_id = ? ORDER BY id DESC LIMIT 1)
    """, (ayahs_per_day, minutes_per_day, user_id))
    conn.commit()
    conn.close()

def set_goals(user_id, ayahs_per_day):
    db_path = '/home/tahanafis2003/Documents/AL-Dhikr/Backend/progress.db'  # Update to full path if necessary
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO goals (ayahs_per_day,user_id) VALUES (?, ?, ?)",
                   (ayahs_per_day, user_id))
    goal_id = cursor.lastrowid
    cursor.execute("INSERT INTO progress (ayahs_read, user_id) VALUES (0, ?)", (user_id,))
    conn.commit()
    conn.close()

def update_progress(user_id, ayahs_read):
    db_path = '/home/tahanafis2003/Documents/AL-Dhikr/Backend/progress.db'  # Update to full path if necessary
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE progress
        SET ayahs_read = ayahs_read + ?
        WHERE user_id = ?
    """, (ayahs_read, user_id))
    conn.commit()
    conn.close()
