import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard.vue',
      component: () => import('../views/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
        requiredAuth: true,
      },
    },
    // Enquêtes
    {
      path: '/enquetes',
      name: 'Surveys',
      component: () => import('../views/Pages/Enquete/Enquete.vue'),
      meta: {
        title: 'Enquêtes',
        requiredAuth: true,
      },
    },
    {
      path: '/creation-enquete',
      name: 'Create-Survey',
      component: () => import('../views/Pages/Enquete/Create.vue'),
      meta: {
        title: "Creation d'enquête",
        requiredAuth: true,
      },
    },
    // Profile
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Pages/Profile/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiredAuth: true,
      },
    },
    // Autres pages
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
        requiredAuth: true,
      },
    },
    //Authentification
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/confirmation',
      name: 'Confirmation',
      component: () => import('../views/Auth/ConfirmationCode.vue'),
      meta: {
        title: 'Confirmation',
      },
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/Auth/ForgotPassword.vue'),
      meta: {
        title: 'ForgotPassword',
      },
    },
    {
      path: '/desapprouve-reinitialisation',
      name: 'DesapprouveReinitialisation',
      component: () => import('../views/Auth/DesapprouveReinitialisation.vue'),
      meta: {
        title: 'ResetPassword',
      },
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        title: 'ResetPassword',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SURVEY MC`
  const survey_mc_token = localStorage.getItem('survey_mc_token')
  const data = survey_mc_token !== null ? JSON.parse(survey_mc_token) : null

  const token = data?.token

  if (to.meta.requiredAuth && !token) {
    return next('/signin')
  } else if (!to.meta.requiredAuth && token) {
    return next('/')
  }
  return next()
})
