//middlware odpalany na endpoint z lista (sprawdzamy czy user ma dostep do danych)

import passport from "passport";

function authMiddleware(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    return next();
  })(req, res, next); //  <= passport sie musi sam "odpalic", zeby dzialalo musi byc taki zapis!
}

export default authMiddleware;

/* const foo = (a) => {
  return (b) => {
    return a + b;
  };
};

console.log(foo(5)(3));
 */
