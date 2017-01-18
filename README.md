# Domain-Collecting-Tool for WPC of Lenovo

__NOTE:__ This project is designed __ONLY__ and __STRICTLY__ for __Lenovo (Beijing) Inc., WPC department.__

The initial user is `admin` with password: `000000`

## Deploy to Production Environment

1. Install [Node.js](https://nodejs.org/en/download/current/) and [Git](https://git-scm.com/downloads)

2. Clone this project `git clone --depth=1 git@github.com:Weston-Liu/Domain-Collecting-System.git`

3. `cd Domain-Collecting-System`

4. `npm run deploy`

5. The app should already be started at port 8888. You can also configure a proxy for other server applications such as Nginx or Apache to use port 80 to access this project, if the port 80 is already occupied by another application.
    * [Nginx](http://stackoverflow.com/questions/5009324/node-js-nginx-what-now/5015178#5015178)
    * [Apache](http://stackoverflow.com/questions/9831594/apache-and-node-js-on-the-same-server/18604082#18604082)

6. Done! Use `npm start` to launch the app.

