<!--crossbow-docs-start-->
## Crossbow tasks

The following tasks have been defined by this project's Crossbow configuration.
Run any of them in the following way
 
```shell
$ crossbow run <taskname>
```
|Task name|Description|
|---|---|
|<pre>`build-all`</pre>|Create Production Assets|
|<pre>`docker`</pre>|Run docker-compose with **dev** config files|
|<pre>`templates`</pre>|Compile HTML Templates from `_src` directory|
|<pre>`deploy`</pre>|Build-all assets & rsync to server|
|<pre>`rsync`</pre>|Copy files from local to remote server|
|<pre>`open`</pre>|**Alias for:**<br>- `@sh open http://$DO_IP`|
<!--crossbow-docs-end-->