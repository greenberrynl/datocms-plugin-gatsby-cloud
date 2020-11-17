# Gatsby Preview DatoCMS plugin

Plugin that allows access to Gatsby Preview instances

## Configuration

In Dato CMS, when your site is served to a DatoCMS subdomain. Click on "Enter project" then go to settings and click on the  Models option in the sidebar.  

This should open up your "product name" settings. Click on the settings of your product and select additional settings.

This is where the "Enable draft/published system" Option is selected. So that changes you save are available in your Gatsby Preview, but not pushed to production.

![Enable draft/published system](https://res.cloudinary.com/ekwuno/image/upload/v1586171014/Screenshot_2020-04-06_at_12.01.23.png)

Please specify a Gatsby Preview instance url (required) and auth token (optional) in the plugin global settings.

![Configuration screenshot](https://user-images.githubusercontent.com/18426780/62660663-ec422180-b92b-11e9-929e-03a66906d851.png)

## Plugin 

Once you've configured the plugin, you will be able to see it as a sidebar widget. 

![Plugin screenshot](https://user-images.githubusercontent.com/18426780/61498855-37e35a00-a982-11e9-8201-ab96be74f1f1.png)

Please note that if the slug field is localized in a specific model, so needs to be the JSON field on which the plugin gets installed.

### Localized Frontend path

The plugin allows you to define a specific path per model, and per locale, where an item should be previewed. 

For instance, your model is called 'posts' and you have a post called 'hello world'. By default, the previewlink would be `SITE_URL/hello-world`. But let's say you have your front set-up so that under the English version of your site the post is accessbile under `SITE_URL/articles/hello-world`. To fix the Gatsby preview-link, make a new (hidden) text-field under your model called `frontendPath` and fill the default value with the correct path for each locale (so `articles` for English). 

### Locale prefix

Use the option "useLocalePath" to give all Gatsby preview links a path-prefix for the current locale. So using the example above, when this option is set to true, the preview-link would become `SITE_URL/en/articles/hello-world`.

Use the option "skipDefaultLocalePath" to disable this option for the default locale.
