from flask import Flask, request, jsonify, render_template
import cohere

app = Flask(__name__)
co = cohere.Client('odGGlygpsDVvxniOuy6yMB1m63OQDv7b3OA2L7kQ')  # Replace with your real key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    try:
        response = co.chat(message=user_message)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'response': f"⚠ Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
