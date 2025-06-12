import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { About } from './components/about/about';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';
import { PasswordReset } from './components/auth/password-reset/password-reset';
import { AuthCallBack } from './components/auth/auth-call-back/auth-call-back';

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
    }


];
