# dta.gov.au theme

A Drupal 8 theme for dta.gov.au.

This is a sub-theme based on the DTA UI Kit Base Theme.

# Requirements

In order to develop this theme, you will need:

1. A local copy of the [site code](https://github.com/govau/dta-website-rebuild). Note the site doesn't need to be running to develop the theme, however if you wish to test changes locally then you'll need a running site.
2. [Composer](https://getcomposer.org/).
3. [NPM](https://www.npmjs.com/) and [NodeJS](https://nodejs.org/en/) version 14.

If you have followed the instructions on installing the site, then you should have the latest version of this theme in your site code already. If you don't, make sure you clone a copy into `docroot/themes/custom/dta-gov-au`.

# Install required files

Run `npm i` from within the theme folder to install the required files.

# Launch a local server using Browser Sync

If you have a local version running you can use Browser Sync to automatically view code changes in the browser as you work. Run `npm run watch` to automatically watch for file changes and compile new CSS files as you go.

CSS changes are automatically injected, and JavaScript and Twig updates will force a cache clear and browser reset.

# Building the CSS files

All style changes are done using SCSS files which are then compiled into a single CSS file. Follow the existing folder and naming convention if you are adding new modules to the SCSS.

To build the CSS files without running a local server, run `npm run build`.

# Template files

The vast majority of HTML in the site is generated using [Twig](https://twig.symfony.com/) templates. If you need to adjust the HTML output, check to see which template is used to create it. This can be done locally by turning on [theme debugging](https://www.chapterthree.com/node/1712). You can then either update the template if it exists in this theme (they are found under the `templates` folder) or copy the template file indicated in the debug comments (found by inspecting the HTML) and update that. You can target specific templates by using the theme hooks indicated by the debugging system.

[Further information on the templating system](https://www.drupal.org/docs/8/theming/twig) is available from the Drupal website.

*Please note:* some templates are available through the [base theme](https://github.com/govau/dta-uikit-base). You can override these through this theme, or make changes there. The instructions to update the base theme are broadly the same (see below) as these.

# Theme functions

If you need to add new variables to Twig files, or adjust some other aspect of the site theme which cannot be done via Twig, then you can use theme functions in the `.theme` file. [Further information on theme functions](https://www.drupal.org/docs/8/theming-drupal-8/modifying-attributes-in-a-theme-file) is available on the Drupal website.

# Adding new CSS or JavaScript files

If you need to add a new CSS or JavaScript file, use the theme `.libraries.yml` file. [Further information on adding libraries](https://www.drupal.org/docs/8/theming/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-theme) is available from the Drupal website.

# Deploying changes

Once you have finished making changes, you can deploy them to the staging and production sites using Github and Circle CI:

1. Create a new branch for your changes.
2. Commit these changes to the repository and start a pull request. Merge the PR (no tests are run on themes as yet). Make sure you are including the built CSS files, as this is not done remotely.
3. Tag the release on Github using [Semantic Versioning](https://semver.org/) conventions. In essence:
    1. Patch or minor backwards-compatible changes to existing functionality increases the third number, so 1.5.6 -> 1.5.7.
    2. New backwards-compatible functionality updates the second number, so 1.5.7 -> 1.6.0.
    3. Finally, major, probably breaking, API changes increase the first number, so 1.6.0 -> 2.0.0.
4. In the site root, `composer require` the new version, for example, `composer require govau/dta-gov-au:1.5.7`. This will update the `composer.json` and `composer.lock` files. It does take a few minutes for the new version to be available and distributed through Packagist, so the new version may not be immediately available to Composer.
5. *Note* if you updated the base theme, you will need to make sure that Composer is aware of these changes. Add ` --with-dependencies` to include any changes to the base theme in `composer.lock`. Note that the base theme is included only as a dependency of this theme, not in `composer.json`.
5. You can then deploy these changes to the site code repository as described at https://github.com/govau/dta-website-rebuild/.
