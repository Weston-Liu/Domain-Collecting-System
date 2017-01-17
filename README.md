# Domain-Collecting-Tool for WPC of Lenovo

## Deploy to Production Environment

1. Install [Node.js](https://nodejs.org/en/download/current/) and [Git](https://git-scm.com/downloads)

2. Clone this project `git clone --depth=1 git@github.com:Weston-Liu/Domain-Collecting-System.git`

3. `cd Domain-Collecting-System`

4. `npm run cn` if the server is located in China

5. `npm install`

6. You can also configure a proxy for other server applications such as Nginx or Apache to use port 80 to access this project, if the port 80 is already occupied by another application.
    * Nginx
    * Apache

7. Done! Use `npm start` to launch the app.

