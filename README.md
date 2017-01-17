# Domain-Collecting-Tool for WPC of Lenovo

## Deploy to Production Environment

1. Install [Node.js](https://nodejs.org/en/download/current/) and [Git](https://git-scm.com/downloads)

2. Clone this project `git clone git@github.com:Weston-Liu/Domain-Collecting-System.git`

3. `cd Domain-Collecting-System`

4. `npm run cnpm` if the server is located in China

5. `npm install`, this will also do steps 6-8 for you automacally

6. ~~Create a new database for this project~~

7. ~~Import `Server/database.sql` to the created database~~

8. ~~Modify `Server/config.js` with correct database configration~~

9. `npm run pro`, now the project will run on port 8888

10. You can also configure a proxy for other server applications such as Nginx or Apache to use port 80 to access this project, if the port 80 is already occupied by another application.
    * Nginx
    * Apache

11. Done! We're all set!
