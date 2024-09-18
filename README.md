# menu-web

## About

The Menu App is designed to transform static menus from various sources such as websites, PDFs, and photos into dynamic, 
interactive experiences. By leveraging this app, you can explore menus enriched with detailed cuisine labels, vivid 
images, comprehensive dish descriptions, dietary labels, and translations. This functionality is particularly useful for 
navigating extensive menus, discovering unfamiliar cuisines, understanding menus in different languages, or simply 
browsing through appetizing images of the dishes. The app aims to enhance your dining experience by making menu 
information more accessible and engaging.

Menu-Web is the front-end of the Menu App. It provides an interface for the user to upload menus and view the 
interactive menu.

## Features

- Accepts various menu inputs: websites, URLs, PDFs, photos, and text.
- Extracts dish name, price, and description from the original menu.
- Applies optional enhancements:
    - Translations
    - Infers cuisine name from dishes
    - Provides dish images from Google
    - Generates descriptions to provide context on dishes
    - Infers dietary labels from dish names
- Enhancements are applied asynchronously for seamless browsing.
- Security via JWT key generation and provision to the user.
