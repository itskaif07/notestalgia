import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';
import { PasswordReset } from './components/auth/password-reset/password-reset';
import { AuthCallBack } from './components/auth/auth-call-back/auth-call-back';
import { Upload } from './components/upload/upload';
import { Browse } from './components/browse/browse';
import { Shop } from './components/shop/shop';
import { Privacy } from './components/legal/privacy/privacy';
import { Terms } from './components/legal/terms/terms';
import { Disclaimer } from './components/legal/disclaimer/disclaimer';


export const routes: Routes = [

    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: About
    },

    // Authentication routes

    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'auth-callback',
        component: AuthCallBack
    },
    {
        path: 'password-reset',
        component: PasswordReset
    },

    //Upload

    {
        path: 'upload',
        component: Upload
    },

    //Browse

    {
        path: 'browse',
        component: Browse
    },

    {
        path: 'shop/:id',
        component: Shop
    },


    // Legal

    {
        path: 'legal',
        children: [
            {
                path: 'privacy',
                component: Privacy
            },
            {
                path: 'terms',
                component: Terms
            },
            {
                path: 'disclaimer',
                component: Disclaimer
            }
        ]
    }


];
