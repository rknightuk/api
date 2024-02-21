monday:
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/lastfm.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/books.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/tv.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/links.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node now/generate.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node now/update.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node utils/backup.js
sunday:
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/overcast/backup.js
	python3 /home/forge/api.rknight.me/services/overcast/fetcher/fetch.py
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/overcast/parser/run.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/overcast/now.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node now/generate.js
daily:
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/github.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/other.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node now/generate.js
hourly:
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/webmentions.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/mastodon.js
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/micro.js
ten:
	cd /home/forge/api.rknight.me; /home/forge/.nvm/versions/node/v19.9.0/bin/node services/discussion.js