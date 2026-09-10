import os
import sys

# Append backend directory to python path for Vercel imports
backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(backend_path))

from app.main import app
