# License server


## Start development
Run the script:
```sh
./scripts/development-start.sh
```

This script will run the wordpress, backend, frontend.
Go to `localhost:80`


## Deploy to production

First you need to add production remote using command below:
```sh
git remote add production licenseportal@52.174.95.201:license-server.git
```

Now just push to the remote:
```sh
git push --force production
```

# Integrate with wordpress

1. Add plugin `wordpress-plugin-licenses-server`
2. Activate that plugin from wordpress admin panel
3. Go to Settings -> Licenses Server and set the licenses server url
Example: http://40.115.32.143/licenses
4. Create new Page for clients with licenses;
4.1 Go to Pages and add new page
4.2 Paste this shortcode to page content to add licenses block on page `[uls-user-licenses]`

Done! Admin page is in the sidebar 'User Licenses'
And customer licenses page there where you add the page.