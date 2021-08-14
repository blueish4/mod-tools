# Blueish's Mod Tools

This project is available hosted on Firebase at [blueish-mod-tools.web.app](https://blueish-mod-tools.web.app).
If you are just looking to use my tools, visit that site and follow the instructions. Below
are instructions for developing and hosting a copy yourself.

*Note that you will need to have [Node.js](https://nodejs.org) installed.*

## Adding your client id

The Twitch API requires you to register a new application, then take the client ID you get
and paste it in src/env.ts where indicated.

## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).
