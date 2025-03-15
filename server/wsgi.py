import os, sys

# force le repertoire Valenstagram à etre dans le python path pour le mode production
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server.app import app

if __name__ == "__main__":
    app.run()