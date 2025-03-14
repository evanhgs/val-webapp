#!/bin/bash
# filepath: /root/Valenstagram/server/entrypoint.sh

set -e

flask db upgrade || flask db init && flask db migrate && flask db upgrade

sleep 2

export FLASK_DEBUG=1
python -m flask run --host=0.0.0.0