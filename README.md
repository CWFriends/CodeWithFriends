[![Netlify Status](https://api.netlify.com/api/v1/badges/faa1505a-b30c-4b1a-9aae-af6e5ac5188b/deploy-status)](https://app.netlify.com/sites/code-with-friends/deploys)

<p align="center">
  <a href="https://code-with-friends.netlify.app">
    <img src="/static/icon.png" alt="Logo" width="160" height="160">
  </a>
</p>

# Code with Friends

Learn new things! Make cool stuff! Have fun! Do all that, with an online community of friends. 

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
  * [Editing Content](#editing-content)
* [Contributing](#contributing)
* [License](#license)
* [Acknowledgements](#acknowledgements)


## About The Project

[This website](https://code-with-friends.netlify.app) is used to support seasonal coding events hosted by [Mayuko](https://www.hellomayuko.com/). Through the website, users can view and participate in the latest seasonal coding event, read news updates, submit projects, and learn more about Code with Friends and its previous events.

### Built With
* [VueJS](https://vuejs.org/) for the frontend framework
* [NuxtJS](https://nuxtjs.org/) for static site generation
* [Netlify](https://www.netlify.com/) for static hosting
* [Netlify CMS](https://www.netlifycms.org/) for Content Management
* [Firebase Authentication](https://firebase.google.com/products/auth) for Github login and data retrieval
* [Firebase Firestore](https://firebase.google.com/products/firestore) for project submissions and signups using a serverless database

## Getting Started

To get a local copy up and running follow these steps.

### Installation

1. Clone the repo with `git clone https://github.com/luisaugusto/CodeWithFriends.git`
2. Make sure you have the latest version of [Node](https://nodejs.org/) installed, and then run `npm install`.
3. Use the following commands to interact with the codebase:

```shell script
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# lint js and vue files
$ npm run lint
```

### Editing Content

Data for the website is split between two entities: [Firebase Firestore](https://firebase.google.com/products/firestore) and [Netlify CMS](https://www.netlifycms.org/). 

Firestore will hold any data relating to users, such as event signups, submissions, and login information. For the purpose of development, that data can be accessed locally and specific rules have been set in place to restrict altering of data. 

Netflify CMS is used for management text content on the website, such as event information, news updates, FAQ content, and legal documents. For those that have access to the CMS (you must be invited by an admin), it can be accessed through the [/admin](https://code-with-friends.netlify.app/admin) path. Even if you do not have access to the CMS, you can still edit and create content in one of two ways:

1. All the content is stored in the repo, inside the [`content`](/content) folder. You can use the data there to copy files and use them as templates for new items, edit text, and other items.

2. While the site is running locally, you can go to any page with content displaying from that [`content`](/content) folder and double click it to edit the content. This is done through [Nuxt Content](https://content.nuxtjs.org/), and an example of how that works can be found on [their website](https://content.nuxtjs.org/displaying#live-editing).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request into the `dev` branch

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Acknowledgements

* [Nuxt Content](https://content.nuxtjs.org/) for reading markdown files
* [Nuxt Firebase](https://firebase.nuxtjs.org/) for easy Firebase integration
* [Vuex](https://vuex.vuejs.org/) for state management
