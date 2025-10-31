import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import directly from app.py file
import importlib.util
spec = importlib.util.spec_from_file_location("app_module", "app.py")
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
create_app = app_module.create_app

if __name__ == '__main__':
    app = create_app()
    
    print("=== Registered Routes ===")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.rule} [{', '.join(rule.methods)}]")
    
    print("\n=== Testing reCAPTCHA endpoint ===")
    with app.test_client() as client:
        response = client.get('/api/auth/recaptcha-config')
        print(f"Status: {response.status_code}")
        print(f"Response: {response.get_json()}")