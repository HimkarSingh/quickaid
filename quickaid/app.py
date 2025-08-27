from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from datetime import datetime
import json

# Create Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = 'quickaid-secret-key-2024'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    """Main homepage"""
    return render_template('index.html')

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    """Handle image upload and analysis"""
    try:
        # Check if image was uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No image selected"}), 400
        
        # For now, return a placeholder response
        # We'll add actual AI analysis in Phase 4
        return jsonify({
            "status": "success",
            "message": "Image received successfully",
            "filename": file.filename,
            "analysis": "AI analysis will be implemented in Phase 4",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

@app.route('/analyze_symptoms', methods=['POST'])
def analyze_symptoms():
    """Handle symptom text analysis"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify({"error": "No symptoms provided"}), 400
        
        symptoms = data.get('symptoms', '').strip()
        
        if not symptoms:
            return jsonify({"error": "Symptoms description is empty"}), 400
        
        # For now, return a placeholder response
        # We'll add actual symptom analysis in Phase 4
        return jsonify({
            "status": "success",
            "symptoms": symptoms,
            "analysis": "Symptom analysis will be implemented in Phase 4",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": f"Error analyzing symptoms: {str(e)}"}), 500

@app.route('/emergency_contacts')
def emergency_contacts():
    """Get emergency contact information"""
    contacts = {
        "emergency": {
            "number": "911",
            "description": "Police, Fire, Medical Emergency"
        },
        "poison_control": {
            "number": "1-800-222-1222",
            "description": "Poison Control Center"
        },
        "mental_health": {
            "number": "988",
            "description": "Suicide & Crisis Lifeline"
        },
        "non_emergency": {
            "number": "311",
            "description": "Non-Emergency Services"
        }
    }
    return jsonify(contacts)

@app.route('/first_aid_guide')
def first_aid_guide():
    """Basic first aid information"""
    guide = {
        "bleeding": "Apply direct pressure with clean cloth",
        "burns": "Cool with running water for 10-20 minutes",
        "choking": "Perform Heimlich maneuver",
        "fracture": "Immobilize and seek medical attention",
        "unconscious": "Check breathing, call 911, recovery position"
    }
    return jsonify(guide)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "QuickAid app is running!",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.route('/test')
def test():
    """Test endpoint for development"""
    return jsonify({
        "message": "Flask routes are working correctly!",
        "routes": [
            "/",
            "/analyze_image [POST]",
            "/analyze_symptoms [POST]",
            "/emergency_contacts",
            "/first_aid_guide",
            "/health"
        ]
    })

# Error handlers
@app.errorhandler(413)
def file_too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🏥 QuickAid - AI First Aid Assistant")
    print("=====================================")
    print("Core Flask Application - Phase 2")
    print("Available endpoints:")
    print("  GET  /                    - Main page")
    print("  POST /analyze_image       - Image analysis")
    print("  POST /analyze_symptoms    - Symptom analysis")
    print("  GET  /emergency_contacts  - Emergency numbers")
    print("  GET  /first_aid_guide     - Basic first aid")
    print("  GET  /health              - Health check")
    print("  GET  /test                - Test routes")
    print("\nVisit http://localhost:5000 to access the app")
    print("Press Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000)