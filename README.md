# 😂

😂 is a blog engine powered by [Deno](https://deno.land). 😂 has no canonical pronunciation, and users are not encouraged to come up with one. 😂 is and always will be 😂 with no way to pronounce it.

😂 stores posts in SQLite and displays them as HTML. 😂 also has JSONFeed support so that external readers can catch up on new happenings.

Xe writes 😂 live on Twitch: https://twitch.tv/princessxen.

# Installation

## Ubuntu

*Tested on Ubuntu 22.04.*

To install 😂 on Ubuntu, first make sure you have `git`, `curl` and `unzip` installed:

```
sudo apt update
sudo apt install git curl unzip
```

Then, install Deno:

```
curl -fsSL https://deno.land/install.sh | sh
```

> **Note**
>
> Make sure to add the Deno `bin` directory to your PATH by putting the provided commands in your `.profile` or similar.

Then, download 😂 to a location of your choosing:

```
git clone https://github.com/Xe/xn--g28h
```

Change into that directory:

```
cd xn--g28h
```

And you're ready to run 😂:

```
deno run --allow-env --allow-read --allow-write --allow-net main.ts
```

Open http://0.0.0.0:8080/admin/blog/create in your favorite browser to create a new post.

TODO: more installation instructions
