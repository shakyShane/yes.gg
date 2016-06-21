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
|<pre>`serve`</pre>|**Alias for:**<br>- `docker`|
|<pre>`docker`</pre>|**Alias for:**<br>- `@sh docker-compose -f docker-compose-dev.yaml up -d`<br>- `@sh docker ps`|
|<pre>`templates`</pre>|Compile HTML Templates|
|<pre>`deploy`</pre>|**Alias for:**<br>- `rsync`|
|<pre>`rsync`</pre>|Copy files from local to remote server|
|<pre>`open`</pre>|**Alias for:**<br>- `@sh open http://$DO_IP`|
<!--crossbow-docs-end-->