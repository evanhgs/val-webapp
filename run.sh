#!/bin/bash

gnome-terminal -- bash -c "cd server && source .venv/bin/activate && flask run --host=0.0.0.0 --debug; exec bash"

gnome-terminal -- bash -c "cd client && npm run dev -- --host; exec bash"