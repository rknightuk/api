import extractUrls from 'extract-urls'
import fs from 'fs'

const OLD_URLS = [
  '/24-hours-of-just-delete-me/',
  '/70decibels-and-5by5/',
  '/a-threads-thread-blog-post/',
  '/add-full-screen-artwork-to-your-podcast/',
  '/add-to-musicthread-shortcut/',
  '/adding-webmentions-to-your-site/',
  '/additional-webmention-resources/',
  '/advent-of-code-2023-day-eight/',
  '/advent-of-code-2023-day-five/',
  '/advent-of-code-2023-day-four/',
  '/advent-of-code-2023-day-nine/',
  '/advent-of-code-2023-day-one/',
  '/advent-of-code-2023-day-seven/',
  '/advent-of-code-2023-day-six/',
  '/advent-of-code-2023-day-three/',
  '/advent-of-code-2023-day-two/',
  '/amazon-echo-initial-thoughts/',
  '/app-defaults/',
  '/apple-privacy-statement/',
  '/asset-lifespan-spreadsheet/',
  '/automatically-rename-tv-shows-with-hazel-and-tvnamer/',
  '/automating-my-now-page/',
  '/biology-of-hey-bear-fruits/',
  '/bionic/',
  '/block-chatgpt-with-robotstxt/',
  '/blogs-and-wikis-and-links/',
  '/brian-butterfield-diet-soundboard/',
  '/building-a-pisight/',
  '/building-an-activitypub-server/',
  '/bulding-podcast-site-eleventy/',
  '/bye-almanac-hello-lantern/',
  '/calendar-events-alfred-workflow/',
  '/changing-your-name-by-deed-poll/',
  '/chatcgt-and-mysql-database-schemas/',
  '/compiling-css-with-eleventy/',
  '/convert-lxf-to-bricklink-xml/',
  '/convert-spotify-facebook-to-email-login/',
  '/create-a-blank-no-header-markdown-table/',
  '/crossover/',
  '/custom-sidebar-icons-in-finder/',
  '/delivery-companies-the-antithesis-of-convenience/',
  '/diy-game-controller-rack/',
  '/doubleshift/',
  '/echo-rss-to-microblog/',
  '/eleventy-post-graph-plugin/',
  '/fifa-street-ps2-game-faqs/',
  '/fix-for-bluetooth-audio-cutting-out-on-the-mac/',
  '/fix-for-low-volume-exported-audio-in-garageband/',
  '/fix-gmail-offline-os-x-yosemite-mail/',
  '/follow-mastodon-user-on-micro.blog-shortcut/',
  '/food-graveyard/',
  '/game-controller-double-standards/',
  '/get-custom-screensavers-on-the-kindle-4-mac-osx/',
  '/get-mastodon-account-id-from-username/',
  '/get-safari-tabs-shortcut/',
  '/getting-closer-to-the-perfect-tv/',
  '/google-reader-and-alternatives/',
  '/hdr-hisense-tv-ps4/',
  '/hold-alt-when-resizing-to-center-windows-on-os-x/',
  '/homescreen-november-2017/',
  '/homescreen-september-2015/',
  '/how-not-to-copy-gif-to-clipboard-programatically/',
  '/how-pf-meet-helped-me-get-a-placement/',
  '/how-to-install-ios8-without-a-developer-account/',
  '/i-am-a-tool/',
  '/im-done-with-closed-services/',
  '/im-not-building-a-podcast-host/',
  '/importing-tweets-into-microblog/',
  '/instapaper-beta/',
  '/its-better-in-the-app-and-other-lies/',
  '/jekyll-category-year-archive/',
  '/just-2022-things/',
  '/just-2024-things/',
  '/just-delete-me/',
  '/just-delete-me-one-million-page-views/',
  '/just-delete-me-ten-years-later/',
  '/lego-back-to-the-future-set-review/',
  '/letters/',
  '/link-dump/',
  '/lite-youtube-for-micro-blog/',
  '/manage-your-lego-collection-with-brickset/',
  '/meta-doesnt-need-activitypub-to-slurp-up-your-data/',
  '/monzo-pot-image-generator/',
  '/monzo-pot-image-generator-version-2/',
  '/music-replay-2022/',
  '/my-favourite-albums-of-2022/',
  '/navigate-project-folders-with-pick/',
  '/new-york/',
  '/no-more-ratings/',
  '/note-on-migrating-wordpress-site-eleventy/',
  '/notes-about-setting-up-retropie/',
  '/office-setup/',
  '/one-year-of-pizza-making/',
  '/oneplus-3-and-switching-to-android/',
  '/parents-take-some-responsibility/',
  '/please-expose-your-rss/',
  '/pokedon-read-mastodon-on-a-pokedex/',
  '/popular-pages-with-eleventy-and-fathom-analytics/',
  '/pramis-challenge/',
  '/pub-hack-1/',
  '/puff-pastry-sausage-roll-recipe/',
  '/relay-fm/',
  '/reminders-alfred-workflow/',
  '/remove-homestead-environment-variables/',
  '/replacing-apps-on-android/',
  '/ruminate-podcast/',
  '/save-bookmark-to-micro-blog-shortcut/',
  '/saving-money-on-lego-in-the-uk/',
  '/simple-git-deploy/',
  '/smart-speed-broke-my-brain/',
  '/so-many-default-apps/',
  '/st-jude-2023/',
  '/st-jude-2023-final-numbers/',
  '/stig-quote-generator/',
  '/subscriptions/',
  '/the-best-apple-tv-apps/',
  '/the-best-tweets/',
  '/the-difference-between-fact-and-trivia/',
  '/the-knightpool/',
  '/the-state-of-passbook-in-the-uk/',
  '/third-party-apple-watch-bands/',
  '/thoughts-on-chromecast/',
  '/thoughts-on-micro-blog/',
  '/thoughts-on-the-iphone-5s-and-5c/',
  '/three-years-of-hemispheric-views-feedback/',
  '/tips-for-apple-tv-app-developers/',
  '/twitter-backup-and-archiving-options/',
  '/two-social-networks-in-this-economy/',
  '/ultraviolet/',
  '/using-pagefind-with-eleventy-for-search/',
  '/using-svg-sprites/',
  '/using-the-johnny-decimal-system/',
  '/web-scraping-with-node-and-cheerio/',
  '/what-to-do-when-your-itunes-account-gets-hacked/',
  '/year-of-renovation/',
]

async function run() {
  try {
    let discussion = JSON.parse(fs.readFileSync('./api/discussion.json'))

    const res = await fetch(`https://social.lol/api/v1/accounts/109523762776095110/statuses?exclude_replies=true&limit=40&exclude_reblogs=true`)

    const toots = await res.json()

    toots.forEach(t => {
        const urls = (extractUrls(t.content) || []).filter(url => url.includes('https://rknight.me'))
        const isSyndicate = urls.some(url => url.includes('https://rknight.me'))

        if (isSyndicate) {
            urls.forEach(url => {
                let path = new URL(url).pathname
                if (!path.startsWith('/blog') && OLD_URLS.includes(path)) {
                    path = `/blog${path}`
                }
                if (!discussion[path]) discussion[path] = {}

                discussion[path][t.id] = t
            })
        }
    })

    fs.writeFileSync('./api/discussion.json', JSON.stringify(discussion, '', 2))

  } catch (error) {
    console.log('unable to fetch mastodon data')
  }
}

run()