<template>
  <div class="relative" ref="dropdownRef">
    <button class="flex items-center text-gray-700 dark:text-gray-400" @click.prevent="toggleDropdown">
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <img src="/images/user/avatar.png" alt="User" />
      </span>

      <!-- <span class="block mr-1 font-medium text-theme-sm">Musharof </span> -->

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
      <!-- <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          Musharof Chowdhury
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          randomuser@pimjo.com
        </span>
      </div> -->

      <!-- <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            <component :is="item.icon" class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            {{ item.text }}
          </router-link>
        </li>
      </ul> -->
      <div
        class="border-b-1 flex items-center gap-3 cursor-pointer px-3 py-2 font-medium text-gray-700 group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        Comptes</div>
      <ul
        class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800 max-h-[200px] overflow-y-auto">
        <li v-for="item in companiesList" :key="item.href">
          <a @click="switchAccount(item.type, item.data)"
            :class="{ 'bg-blue-500 text-white': isActiveAccount(item.data) || (item.type === 'personal' && isPersonalAccount()) }"
            class="flex items-center gap-3 cursor-pointer px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
            {{ item.text }}
          </a>
        </li>
      </ul>
      <router-link to="/signin" @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
        <LogoutIcon class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        Déconnexion
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { authStore } from '@/stores/auth/auth'
import { get_account_id, get_account_type } from '@/composables/request';

import { storeToRefs } from 'pinia'
import { companyStore } from "@/stores/company/companyStore";
const store = companyStore()
const { companies } = storeToRefs(store)
const { switchAccount } = store
const { deconnect } = authStore()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)



const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  deconnect()
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}
const menuItems = [
  // { href: '/profile', icon: UserCircleIcon, text: 'Basculer' },
  // { href: '/chat', icon: SettingsIcon, text: 'Account settings' },
  // { href: '/profile', icon: InfoCircleIcon, text: 'Support' },
]
let companiesList = [
  { type: 'personal', data: '', text: 'Compte personnel' },
]

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

watch(() => companies.value, (newV) => {
  if (newV.length > 0) {
    companiesList = [
      { type: 'personal', data: '', text: 'Compte personnel' },
    ]
    companies.value.forEach((e) => {
      companiesList.push(
        { type: 'enterprise', data: e, text: e.denomination },
      )
    })
  }
})


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const isActiveAccount = (company) => {
  return get_account_id() === company._id
}

const isPersonalAccount = () => {
  return get_account_type() === 'personal'
}
</script>
