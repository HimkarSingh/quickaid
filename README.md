# QuickAid - AI First Aid Assistant

QuickAid is an AI-powered web application designed to assist users with first aid guidance, emergency contacts, and basic health analysis. Built with Flask, it provides a simple interface for uploading injury photos, describing symptoms, and accessing essential first aid information.

## Features

- **Analyze Injury Photo:** Upload a photo of an injury for future AI-based analysis (feature placeholder).
- **Describe Symptoms:** Enter symptoms or describe an emergency situation for analysis (feature placeholder).
- **Emergency Contacts:** Quick access to emergency numbers like 911, Poison Control, and more.
- **First Aid Guide:** Basic instructions for common emergencies (bleeding, burns, choking, etc.).
- **Health Check Endpoint:** Simple API health check for monitoring.

## Project Structure

```
quickaid/
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── static/               # Static files (CSS, JS, images)
│   ├── css/
│   ├── js/
│   └── images/
├── templates/            # HTML templates
│   └── index.html
├── uploads/              # Uploaded images (user data)
├── data/                 # (Optional) Data files
├── models/               # (Optional) AI/ML models
├── utils/                # (Optional) Utility scripts
└── quickaid_env/         # Python virtual environment (ignored by git)
```

## Getting Started

### Prerequisites
- Python 3.8+
- pip

### Setup
1. **Clone the repository:**
	```bash
	git clone https://github.com/HimkarSingh/quickaid.git
	cd quickaid
	```
2. **Create a virtual environment:**
	```bash
	python3 -m venv quickaid_env
	source quickaid_env/bin/activate
	```
3. **Install dependencies:**
	```bash
	pip install -r requirements.txt
	```
4. **Run the app:**
	```bash
	cd quickaid
	python app.py
	```
5. **Open your browser:**
	Visit [http://localhost:5000](http://localhost:5000)

## API Endpoints

- `GET /` — Main homepage
- `POST /analyze_image` — Upload and analyze an injury photo
- `POST /analyze_symptoms` — Analyze described symptoms
- `GET /emergency_contacts` — Emergency contact numbers
- `GET /first_aid_guide` — Basic first aid instructions
- `GET /health` — Health check
- `GET /test` — Test endpoint

## Notes
- AI analysis features are placeholders and will be implemented in future phases.
- Uploaded images are stored in the `uploads/` directory.
- The virtual environment folder (`quickaid_env/`) is ignored by git.

## License
MIT License

---

*Made with ❤️ for quick, accessible first aid help.*