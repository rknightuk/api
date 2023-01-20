monday:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/music.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/books.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/psn.js
friday:
	python3 services/overcast/fetcher/fetch.py
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/parser/run.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/now.js
daily:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/github.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/other.js
hourly:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node services/statuses.js
