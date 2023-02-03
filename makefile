monday:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/lastfm.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/books.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/psn.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/now/generate.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/now/update.js
sunday:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/overcast/backup.js
	python3 /home/forge/api.rknight.me/services/overcast/fetcher/fetch.py
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/overcast/parser/run.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/overcast/now.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/now/generate.js
daily:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/github.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/other.js
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/now/generate.js
hourly:
	/home/forge/.nvm/versions/node/v19.2.0/bin/node /home/forge/api.rknight.me/services/webmentions.js
