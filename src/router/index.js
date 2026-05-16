import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
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
      component: () => import('../views/Pages/Survey/Survey.vue'),
      meta: {
        title: 'Enquêtes',
        requiredAuth: true,
      },
    },
    {
      path: '/creation-enquete/:id',
      name: 'Create-Survey',
      component: () => import('../views/Pages/Survey/Create.vue'),
      meta: {
        title: "Creation d'enquête",
        requiredAuth: true,
      },
    },
    {
      path: '/brouillons',
      name: 'Draft-Survey',
      component: () => import('../views/Pages/Survey/DraftSurvey.vue'),
      meta: {
        title: 'Enquêtes brouillons',
        requiredAuth: true,
      },
    },
    {
      path: '/update-survey/:survey_id',
      name: 'Update-Survey',
      component: () => import('../views/Pages/Survey/Update.vue'),
      meta: {
        title: "Modification d'enquête",
        requiredAuth: true,
      },
    },
    {
      path: '/forms/:id',
      name: 'Survey-Form',
      component: () => import('../views/Pages/Survey/Form.vue'),
      meta: {
        title: 'Formulaire',
      },
    },
    {
      path: '/centres-formations',
      name: 'CentreDeFormation',
      component: () => import('../views/Pages/Company/Company.vue'),
      meta: {
        title: 'Mes Centres de Formations',
        requiredAuth: true,
      },
    },
    {
      path: '/formulaire-envoye',
      name: 'Response-Send',
      component: () => import('../views/Pages/Survey/ResponseSend.vue'),
      meta: {
        title: 'Formulaire envoyé',
      },
    },
    {
      path: '/enquete/:id',
      name: 'Survey-Detail',
      component: () => import('../views/Pages/Survey/Detail/Index.vue'),
      meta: {
        title: 'Détail enquête',
        requiredAuth: true,
      },
    },
    {
      path: '/collaborateurs',
      name: 'Collaborateurs',
      component: () => import('../views/Pages/User/User.vue'),
      meta: {
        title: 'Liste des collaborateurs',
        requiredAuth: true,
      },
    },
    {
      path: '/join_company',
      name: 'Join company',
      component: () => import('../views/Pages/User/JoinCompany.vue'),
      meta: {
        title: 'Liste des collaborateurs',
        requiredAuth: true,
      },
    },
    {
      path: '/roles',
      name: 'Roles',
      component: () => import('../views/Pages/Role/Role.vue'),
      meta: {
        title: 'Roles',
        requiredAuth: true,
      },
    },

    {
      path: '/roles/:id/permissions',
      name: 'Permissions',
      component: () => import('../views/Pages/Role/Permission.vue'),
      meta: {
        title: 'Roles',
        requiredAuth: true,
      },
    },
    {
      path: '/configurations',
      name: 'Configurations',
      component: () => import('../views/Pages/Config/Header.vue'),
      meta: {
        title: 'Configurations',
        requiredAuth: true,
      },
    },
    {
      path: '/thematiques',
      name: 'Catégories',
      component: () => import('../views/Pages/Topic/Index.vue'),
      meta: {
        title: 'Catégories',
        requiredAuth: true,
      },
    },
    {
      path: '/dimensions-analytiques',
      name: 'Dimensions analytiques',
      component: () => import('../views/Pages/AnalyticsDimensions/Index.vue'),
      meta: {
        title: 'Dimensions analytiques',
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
      path: '/confirmation/:id',
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

  if (to.name === 'Survey-Form') {
    return next()
  } else if (to.name === 'Dashboard') {
    return next('/enquetes')
  } else {
    if (to.meta.requiredAuth && !token) {
      return next('/signin')
    } else if (!to.meta.requiredAuth && token) {
      return next('/')
    }
    return next()
  }
})
