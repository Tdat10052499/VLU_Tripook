import sys
import os
# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# Import from app.py file, not app module
import app
create_app = app.create_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001, host='127.0.0.1')