<template>

  <nav class='header-navbar navbar-expand-lg navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center'>
    <div class='navbar-container d-md-flex align-items-center content justify-content-between'>
      <div class='d-sm-flex align-items-center'>
        <ul class='nav navbar-nav'>
          <router-link v-for='link in links' :key='link.text' :exact='link.exact'
            :to='link.to' custom v-slot='{ href, navigate, isActive }'>
            <li class='nav-item' :class="{ 'active': isActive }">
              <b-link class='nav-link py-50 px-75' :href='href' @click='navigate'>
                <component :is='link.icon' size='1.5x' />
                {{ $t(`navigations.${link.text}`) }}
              </b-link>
            </li>
          </router-link>
        </ul>
      </div>
      <div class='d-flex align-items-center flex-fill'>
        <div class='flex-grow-1 ms-md-2 me-2 me-md-1'>
          <b-form-input size='sm' :disabled='loadingNotes'
            v-model='search' :placeholder="$t('placeholder_search')"
            type='search' autocomplete='off' @keyup.enter='onSubmit'
          ></b-form-input>
        </div>

        <ul class='nav navbar-nav ms-auto justify-content-center'>
          <li class='nav-item dropdown dropdown-user'>
            <b-dropdown class=''
              variant='temp' toggle-tag='a' text='' right
              toggle-class='nav-link dropdown-toggle dropdown-user-link'
            >
              <template #button-content>
                <div class='user-nav d-sm-flex d-none'>
                  <span class='user-name fw-bolder'>Dang Khoa</span>
                  <span class='user-status mt-50'>{{ $t('top-header.admin_role') }}</span>
                </div>
                <span class='avatar'>
                  <img class='round'
                    src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/portrait/small/avatar-s-11.jpg'
                    alt='avatar' height='40' width='40' />
                  <span class='avatar-status-online'></span>
                </span>
              </template>
              <b-dropdown-item @click='logout'>
                <span class='d-flex align-items-center'>
                  <log-out-icon class='me-1' /> {{ $t('top-header.logout') }}
                </span>
              </b-dropdown-item>
            </b-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </nav>

</template>

<script src='./top-header.js'></script>
