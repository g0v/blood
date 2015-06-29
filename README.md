# blood

A cron job for fetching data from blood.org.tw, convert to JSON file and send to gh-pages.

# Usage

Generated json here: http://g0v.github.io/blood/blood.json

export GH_TOKEN & GH_REF to your environment variables

```shell
export GH_TOKEN=<GH_TOKEN>
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
