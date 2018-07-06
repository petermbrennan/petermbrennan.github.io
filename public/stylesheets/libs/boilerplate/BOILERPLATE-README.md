## Using the Theme Boilerplate

When creating a new theme, you must import the boilerplate files into your scss file. The boilerplate contains a collection of variables, mixins, and default css to speed and standardize development.

All files are well documented and you should also familiarize yourself with the [Bourbon mixin library](http://bourbon.io)


### Summary of Usage

To use the boilerplate, at the top of your theme scss file enter the following:

```
@import 'boilerplate/setup';
```

Under that you may override any variables from the setup/_variables.scss file.
For example:

```
$base-background: #fff;
$site-width: 960px;
```


Under your theme variables import the boilerplate defaults file:

```
@import 'boilerplate/defaults';
```

You may now import the optional files as needed from these folders:

1. widgets (or import _widgets.scss to get all widget files)
2. theme-types
3. page components
4. content-stripes

Finished code looks like this:

```
@import 'setup';

// variable overrides
$base-color: #222;
$site-width: 1400px;

@import 'defaults';

// Additional but optional files
@import 'widgets';
@import 'theme-types/stripes';
@import 'page-components/header-inline';
@import 'hero-image';
```

Under this you may build out your theme.


### Boilerplate Files

- _setup.scss
    - Imports all setup files, include variables, mixins, and utility classes
- _defaults.scss
    - Imports all default files, including normalize, general styles, and mobile nav
- _widgets.scss
    - Imports all standard widget files, which add some common styles for popular widets
- **content-stripes/**
  - _hero.scss
    - Adds the hero row class for a large image with widgets overlaying it
- **page-components/**
  - _header-base.scss, _navigation-base.scss
    - Starting point for header styles. Suggested to use one of the following header files instead.
  - _header-inline.scss, _header-stacked.scss
    - CSS for common header layouts and functionality. Screenshots in __examples/
  - _footer.scss
    - Basic layout for site footer
- **theme-types**
  - _stripes.scss
    - Most common theme type. Basic style for themes with full width rows with contstrained content
  - _mosaic.scss
    - *Styles need to be added to this from the Cobalt theme*
