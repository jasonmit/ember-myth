# ember-myth

Preprocess your CSS using Myth.

> Myth is a preprocessor that lets you write pure CSS without having to worry about slow browser support, or even slow spec approval. It's like a CSS polyfill.

## Installation

```
npm install --save-dev ember-myth
```

## Usage

By default, this addon will compile `app/styles/<app-name>.css` into `dist/assets/<app-name>.css`.  To change this, use the configure the options object, detailed below, and set `mythOptions.outputFile`.

Options can be configured within your `Brocfile.js` or from within `config/environment.js`:

```javascript
// Brocfile.js
var app = new EmberApp({
	mythOptions: {...}
	...
});
```

```javascript
module.exports = function (/* env */) {
	return  {
		mythOptions: {...}
		...
	}
};
```

## Available Options
- `browsers` - `Array` - an array of [browsers and versions to support](https://github.com/postcss/autoprefixer#browsers).
- `compress` - `Boolean` - whether to compress the CSS output.
- `source` - `String` - the full path to the source CSS file. This is necessary if you want Myth to concatenate `@import` rules in your CSS.
- `features` - `Object` - any features you'd like to disable. All features are enabled by default. For example:
```js
features: {
	import: false,
	variables: false,
	customMedia: false,
	hexAlpha: false,
	color: false,
	calc: false,
	fontVariant: false,
	rebeccapurple: false,
	prefixes: false
}
```

## Why Myth?

> Myth lets you write pure CSS while still giving you the benefits of tools like LESS and Sass. You can still use variables and math functions, just like you do in preprocessors. It's like a polyfill for future versions of the spec.

> Some of the features in CSS require runtime calculations, which neither Myth nor preprocessors handle, but what Myth does is let you write your code today in the future syntax, so that your code is future-proof. When browsers finally support these features you won't need to rewrite anything, just start using the cascade!

> Taking plain CSS as an input also means you can use Myth to re-process anyone else's CSS (or another preprocessors output), adding the browser support you need, without having to re-write the code in a completely different syntax.

> Myth is built with Rework so it's incredibly fast, and has a nice Javascript API in addition to the CLI.

(Credits: [myth#why](https://github.com/segmentio/myth#why))

## References

- [myth](https://github.com/segmentio/myth)