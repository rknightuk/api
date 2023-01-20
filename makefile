monday:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/music.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/books.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/psn.js
friday:
	python3 /home/forge/api.rknight.me/overcast/fetcher/fetch.py
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/parser/run.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/now.js
daily:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/github.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/other.js
hourly:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/statuses.js
