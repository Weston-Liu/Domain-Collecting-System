# Domain-Collecting-Tool for WPC of Lenovo

## Deploy to Production Environment

1. Install [Node.js](https://nodejs.org/en/download/current/) 

2. Clone this project `git clone git@github.com:Weston-Liu/Domain-Collecting-System.git`

3. `cd Domain-Collecting-System`

4. `npm install` (If too slow, run `npm config set registry http://registry.npm.taobao.org` first)

5. Create a new database for this project

6. Import `Server/database.sql` to the created database

7. Modify `Server/config.js` with correct database configration

8. `npm run pro`, now the project will hopefully run on port 8888

9. You can also configure a proxy for other server applications such as Nginx or Apache to use port 80 to access this project, if the port 80 is already occupied by another application.
    * Nginx
    * Apache

10. Done! We're all set!
