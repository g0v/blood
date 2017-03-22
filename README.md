# blood

A cron job for fetching data from blood.org.tw, convert to JSON file and send to gh-pages.

# Generated JSON file

JSON file is generated every hour and upload to here: http://g0v.github.io/blood/blood.json

# Run on local machine

Goto [Github Settings](https://github.com/settings/profile) -> **Personal access tokens** to create a new token.

export GH_TOKEN & GH_REF to your environment variables

```shell
export GH_TOKEN=<YOUR_GITHUB_TOKEN>
export GH_REF=github.com/g0v/blood.git
```

Install dependencies:

```shell
npm install
```

and execute `main.js` to fetch data blood.org.tw, convert to json and send to gh-pages.

```shell
node main.js
```

# License

MIT License
