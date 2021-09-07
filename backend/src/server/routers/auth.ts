import { Router } from 'express';

import passport from 'passport';
import { Strategy as PassportLocal } from 'passport-local';

import Controllers from '../../controllers/index';

import { CreateUser } from '../../core/user/model';

import wrap from './utils/wrap';

passport.use(new PassportLocal({
        usernameField: 'email',
        passwordField: 'password'
    }, (username, password, done) => {
        Controllers.user.verify(username, password)
            .then(user => done(null, user))
            .catch(err => done(err))
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((id, done) => {
    if (typeof id === 'string') {
        Controllers.user.find({ id })
            .then(user => {
                if(!user) done(new Error('user not found'));
                done(null, user);   
            })
            .catch(err => done(err))
    
        return;
    }

    done(new Error('already logged'));
});

const router = Router();

router.post('/signin', passport.authenticate('local'), wrap(async () => true));

router.post('/signup', wrap(async (req) => {    
    const cmd: CreateUser = req.body;

    await Controllers.user.create(cmd);

    return true;
}))

router.post('/logout', wrap(async (req) => {    
    req.logOut();
    return true;
}))

export default router;