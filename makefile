monday:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/lastfm.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/books.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/psn.js
friday:
	python3 /home/forge/api.rknight.me/services/overcast/fetcher/fetch.py
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/overcast/parser/run.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/overcast/now.js
daily:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/github.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/other.js
hourly:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/statuses.js
