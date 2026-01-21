# Server Status
- **Server Type**: Production (Waitress)
- **Host**: 0.0.0.0
- **Port**: 5000
- **Status**: Running

## Why Waitress?
The warning "This is a development server" appears when using Flask's built-in `app.run()`. This is not suitable for production because it's single-threaded and not optimized for security or performance.

We switched to **Waitress**, a production-quality WSGI server for Python that works excellently on Windows.

## How to Run
```bash
cd backend
python app.py
```
Output should be:
```
Starting production server with Waitress on http://0.0.0.0:5000
```
