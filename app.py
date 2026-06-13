import subprocess
import sys
import threading
import webbrowser
import time
import os

# Auto-install Flask if not present
try:
    from flask import Flask, jsonify, request, send_from_directory
except ImportError:
    print("Flask not found. Installing automatically...")
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'flask'])
    from flask import Flask, jsonify, request, send_from_directory

from algorithms.bubble_sort import bubble_sort
from algorithms.selection_sort import selection_sort
from algorithms.insertion_sort import insertion_sort
from algorithms.merge_sort import merge_sort
from algorithms.quick_sort import quick_sort

app = Flask(__name__, static_folder='static')

ALGORITHMS = {
    'bubble': bubble_sort,
    'selection': selection_sort,
    'insertion': insertion_sort,
    'merge': merge_sort,
    'quick': quick_sort,
}

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/sort', methods=['POST'])
def sort():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON body provided'}), 400

    algorithm = data.get('algorithm', 'bubble')
    array = data.get('array', [])

    if algorithm not in ALGORITHMS:
        return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400

    if not isinstance(array, list) or len(array) < 2:
        return jsonify({'error': 'Array must have at least 2 elements'}), 400

    if len(array) > 150:
        return jsonify({'error': 'Array too large (max 150)'}), 400

    try:
        sort_fn = ALGORITHMS[algorithm]
        steps, comparisons, swaps = sort_fn(array)
        return jsonify({
            'steps': steps,
            'total_comparisons': comparisons,
            'total_swaps': swaps,
            'total_steps': len(steps)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def open_browser():
    time.sleep(1.5)
    webbrowser.open('http://localhost:5000')


if __name__ == '__main__':
    print("=" * 50)
    print("  Sorting Algorithm Visualizer")
    print("  http://localhost:5000")
    print("=" * 50)
    threading.Thread(target=open_browser, daemon=True).start()
    app.run(debug=True, port=5000, use_reloader=False)
