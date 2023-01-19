# https://gist.github.com/cleverdevil/a8215850420493c1ee06364161e281c0

'''
You'll need to pip install some dependencies:

* requests

Also, populate your EMAIL and PASSWORD below.
'''

from xml.etree import ElementTree

import conf
import re
import sys
import requests
import pickle
import os.path
import json

# load stored session, or re-authenticate
if os.path.exists(conf.SESSION_PATH):
    print('Found saved session. Restoring!')
    session = pickle.loads(open(conf.SESSION_PATH, 'rb').read())
else:
    print('No saved session. Authenticating!')
    session = requests.Session()
    response = session.post('https://overcast.fm/login', data={
        'email': conf.EMAIL,
        'password': conf.PASSWORD
    })

    if response.status_code != 200:
        print('Authentication failed')
        sys.exit(0)

    print('Authenticated successfully. Saving session.')

    with open(conf.SESSION_PATH, 'wb') as saved_session:
        saved_session.write(pickle.dumps(session))

# fetch the latest detailed OPML export from Overcast
print('Fetching latest OPML export from Overcast')
response = session.get('https://overcast.fm/account/export_opml/extended')
if response.status_code != 200:
    print('Failed to fetch OPML. Exiting.')
    print(response.text)
    print(response.headers)
    sys.exit(0)

# cache the last OPML file
try:
    with open('./services/overcast/overcast.opml', 'w') as f:
        f.write(response.text)
except:
    print('Unable to cache OPML file.')
