#Delicious API for node.js

##Installation

```shell
npm install -g npm-delicious
```



setup following environment variables:

* DELICIOUS_CLIENT_ID
* DELICIOUS_CLIENT_SECRET
* DELICIOUS_USER
* DELICIOUS_PASS

visit [`https://delicious.com/settings/developer`](https://delicious.com/settings/developer) for client_id and client_secret



##Get Links

```shell
delicious --tags=tag1,tag2,tagn
```

more options

* --tags=tag1,tag2 (optional) — Filter by this tags (separate by comma)
* --start={xx} (optional) — Start returning posts this many results into the set.
* --results={xx} (optional) — Return up to this many results. By default, up to 1000 bookmarks are returned, and a maximum of 100000 bookmarks is supported via this API.
* --fromdt={CCYY-MM-DDThh:mm:ssZ} (optional) — Filter for posts on this date or later.
* --todt={CCYY-MM-DDThh:mm:ssZ} (optional) — Filter for posts on this date or earlier.




##Add Link

```shell
delicious add "www.exampleurl.net" --tags=tag1,tag2,tagn --description="Page Title"
```

more options

* --extended=`...` (optional) — Notes for the item.
* --replace=`yes` (optional) — Replace post if given url has already been posted. (Default: `no`)
* --shared=`yes` (optional) — Make the item public (Default: `no`)

##Contact

[`hagb4rd@gmail.com`](https://github.com/hagb4rd)

hail eris!
