Commands

Create thumbs

```shell
mogrify  -format jpg -path thumbs -thumbnail 150x150 *.jpg
```

rename files
```shell
rename -X -e '$_ = "$N-large"' *
```

<!--crossbow-docs-start-->
## Crossbow tasks

The following tasks have been defined by this project's Crossbow configuration.
Run any of them in the following way
 
```shell
$ crossbow run <taskname>
```
|Task name|Description|
|---|---|
|<pre>`build-all`</pre>|Wipe compiled files & re-create HTML/JS/CSS|
|<pre>`build-css`</pre>|Build production ready CSS files|
|<pre>`build-js`</pre>|**Alias for:**<br>- `webpack`|
|<pre>`deploy-light`</pre>|Only build HTML and deploy static assets|
|<pre>`deploy`</pre>|Build-all assets & rsync to server|
|<pre>`webpack`</pre>|**Alias for:**<br>- `@npm webpack --config webpack-prod.config.js`|
|<pre>`build-html`</pre>|**Alias for:**<br>- `crossbow`|
|<pre>`docker`</pre>|Run docker-compose with **dev** config files|
|<pre>`rsync`</pre>|Copy files from local to remote server|
|<pre>`docker-remote`</pre>|**Alias for:**<br>- `@sh ssh $AUTH "cd $DOCKER_NAME && docker-compose restart"`|
|<pre>`open`</pre>|**Alias for:**<br>- `@sh open http://$DO_IP`|
|<pre>`reload-nginx`</pre>|**Alias for:**<br>- `@sh docker exec $DOCKER_NAME nginx -s reload`|
|<pre>`clean`</pre>|Wipe built assets (html/js/css)|
<!--crossbow-docs-end-->
