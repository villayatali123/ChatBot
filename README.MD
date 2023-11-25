Author : Villayat Ali

#### this project is first tested properly on postman


#### Backend-Language : Node.js

#### Framework : Express.js

#### Database : MongoDB

#### Password are encrypted properly using bcrypt package

#### Security

- helmet: sets various http headers to prevent numerous attacks

- cors: (cross origin resourse sharing) its a liabrary which ensure that our api is accessable from every domain

- xss-clean : liabrary that which sanatizes the user input in req.body,req.params as a result
  protects us from cross script attack where the attcker try to injects Malicious code

- express-rate-limit : limit the amount of request a user can make
