import xml.etree.ElementTree as ET
from flask import jsonify

# Parse the Quran XML file
tree = ET.parse('Qur\'aan.xml')
root = tree.getroot()

# Preload Quran data into a list for easier access
quran_data = []

for surah in root.findall('sura'):
    surah_number = int(surah.get('index'))
    for ayah in surah.findall('aya'):
        ayah_number = int(ayah.get('index'))
        ayah_text = ayah.get('text')
        quran_data.append({
            "Surah_Number": surah_number,
            "Ayah_Number": ayah_number,
            "Ayah_Text": ayah_text
        })

# Function to get all Ayahs for a specific Surah
# Function to get all Ayahs for a specific Surah with the Arabic name included
def get_surah(surah_number):
    surah = root.find(f"./sura[@index='{surah_number}']")
    if not surah:
        return jsonify({"error": "Surah number not correct"}), 404

    # Fetch Surah name in Arabic
    surah_name = surah.get('name')
    ayahs = [{
        "Surah_Number": surah_number,
        "Ayah_Number": int(ayah.get('index')),
        "Ayah_Text": ayah.get('text')
    } for ayah in surah.findall('aya')]

    # Return Arabic name and all Ayahs
    return jsonify({"Surah_Name": surah_name, "Ayahs": ayahs})

# Function to get a specific Ayah from a Surah
def get_ayah(surah_number, ayah_number):
    surah_ayah = next((ayah for ayah in quran_data if ayah['Surah_Number'] == surah_number and ayah['Ayah_Number'] == ayah_number), None)
    if not surah_ayah:
        return jsonify({"error": "Ayah number not correct"}), 404
    return jsonify(surah_ayah)

# Function to get translations for all Ayahs in a Surah
def get_translation_surah(lang, surah_number):
    file_name = 'en_sahih.xml' if lang == 'en' else 'ur_translation.xml'
    translations = []
    try:
        tree = ET.parse(file_name)
        root = tree.getroot()
        for surah in root.findall('sura'):
            if surah.get('index') == str(surah_number):
                for ayah in surah.findall('aya'):
                    translations.append({
                        'Ayah_Number': int(ayah.get('index')),
                        'Ayah_Translation': ayah.get('text')
                    })
                break
    except FileNotFoundError:
        return jsonify({"error": f"Translation file for {lang} not found."}), 404
    if not translations:
        return jsonify({"error": "Surah number not correct"}), 404
    return jsonify(translations)

# Function to get a translation for a specific Ayah
def get_translation_ayah(surah_number, ayah_number):
    for surah in root.findall('sura'):
        if surah.get('index') == str(surah_number):
            for ayah in surah.findall('aya'):
                if ayah.get('index') == str(ayah_number):
                    return jsonify({
                        'Ayah_Number': int(ayah.get('index')),
                        'Ayah_Translation': ayah.get('text')
                    })
    return jsonify({"error": "Ayah number not correct"}), 404
