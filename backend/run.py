import sys
import os
# Add current directory to Python path  
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import from app.py file directly
import importlib.util
app_path = os.path.join(current_dir, "app.py")
spec = importlib.util.spec_from_file_location("app_module", app_path)
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
create_app = app_module.create_app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001, host='127.0.0.1')