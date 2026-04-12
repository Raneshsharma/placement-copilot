import json
import time
import base64
import hmac
import hashlib
import urllib.request
import urllib.parse

with open('firebase-service-account.json') as f:
    creds = json.load(f)

private_key = creds['private_key'].replace('-----BEGIN PRIVATE KEY-----\n', '').replace('-----END PRIVATE KEY-----\n', '').replace('\\n', '\n')
private_key_bytes = base64.urlsafe_b64decode(base64.urlsafe_b64encode(private_key.encode()))

header = base64.urlsafe_b64encode(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode()).decode().rstrip('=')
now = int(time.time())
payload = base64.urlsafe_b64encode(json.dumps({
    'iss': creds['client_email'],
    'sub': creds['client_email'],
    'aud': 'https://oauth2.googleapis.com/token',
    'scope': 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase.management',
    'iat': now,
    'exp': now + 3600
}).encode()).decode().rstrip('=')

signing = hmac.new(private_key_bytes, f"{header}.{payload}".encode(), hashlib.sha256).digest()
sig = base64.urlsafe_b64encode(signing).decode().rstrip('=')
jwt = f"{header}.{payload}.{sig}"

req = urllib.request.Request('https://oauth2.googleapis.com/token', data=json.dumps({
    'grant_type': 'urn:ietf:params:oauth2:grant-type:jwt-bearer',
    'assertion': jwt
}).encode(), headers={'Content-Type': 'application/json'})
resp = urllib.request.urlopen(req)
token_data = json.loads(resp.read())

print(token_data.get('access_token', 'ERROR: ' + str(token_data)))
