# Domain-Collecting-Tool for WPC of Lenovo

## Deploy to Production Environment

1. Install [Node.js](https://nodejs.org/en/download/current/) 

2. Clone this project `git clone git@github.com:Weston-Liu/Domain-Collecting-System.git`

3. `cd Domain-Collecting-System`

3. `npm install` (If too slow, `npm config set registry http://registry.npm.taobao.org`)

4. Create a new database for this project

5. Modify `Server/config.js` with correct database configration

6. Import `Server/database.sql` to the database

7. `npm run pro`, now the project will hopefully run on port 8888

8. You can also configure a proxy for other server applications such as Nginx or Apache to use port 80 to access it, if the port 80 is occupied by another application.
    * Nginx
    * Apache

9. Done! We're all set!
