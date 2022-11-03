<template>
  
  <div class='content-wrapper container-xxl p-0'>
    <div class='content-header row'>
      <div class='content-header-right text-md-end col-md-3 col-12 d-none'>
        <div class='mb-1 breadcrumb-right'>
          <b-dropdown
            variant='warning'
            text='' right
            toggle-class='px-1'
          >
            <template #button-content>
              <grid-icon />
            </template>
            <b-dropdown-item>
              <check-square-icon class='me-1' size='1.5x' />
              <span class='align-middle'>Todo</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <message-square-icon class='me-1' size='1.5x' />
              <span class='align-middle'>Chat</span>
            </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item>
              <mail-icon class='me-1' size='1.5x' />
              <span class='align-middle'>Email</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <calendar-icon class='me-1' size='1.5x' />
              <span class='align-middle'>Calendar</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </div>

    <div class='content-body'>
      <div class='card card-developer-meetup'>
        <div class='meetup-img-wrapper rounded-top text-center'><img src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/illustration/email.svg' alt='top banner' height='170' /></div>
        <div class='card-body rounded-bottom card-congratulations text-center'>
          <img src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/elements/decore-left.png' alt='card-img-left' class='congratulations-img-left' />
          <img src='https://summer-rain-10d0.dangkhoa2016.workers.dev/images/elements/decore-right.png' alt='card-img-right' class='congratulations-img-right' />
          <div class='avatar avatar-xl bg-primary shadow'>
            <div class='avatar-content'>
              <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'
              fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'
              stroke-linejoin='round' class='feather feather-award font-large-1'>
                <circle cx='12' cy='8' r='7'></circle>
                <polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'></polyline>
              </svg>
            </div>
          </div>
          <div class='text-center'>
            <h2 class='mb-1 text-white d-inline'>{{ $t('home.top_banner.message1') }} </h2>
            <h1 class='text-white d-inline'>{{ $t('home.top_banner.message2') }}</h1>
            <h2 class='d-inline'> 🚀</h2>
          </div>
        </div>
      </div>

      <h3 class='text-center'>{{ $t('home.summary.header') }}</h3>
      <div class='row row-cols-1 row-cols-md-2 g-2 my-1'>
        <div class='col mt-0' v-for='(navigation, index) in navigations' :key='`navigation-${index}`'>
          <div class='card mb-2'>
            <div class='card-body'>
              <div class='d-flex align-items-center'>
                <div class='avatar-content'>
                  <component :is='navigation.icon' :class='`text-${getColor(index)}`' size='3x' />
                </div>
                <h4 class='mb-0 ms-1'>{{ $t(`navigations.${navigation.text}`) }}</h4>
              </div>
              <div class='d-flex mt-1 justify-content-between'>
                <ul>
                  <li v-for='(action, index) in actions.col1' :key='`actions-${index}`'>{{ $t(`home.action.${action}`) }}</li>
                </ul>
                <ul>
                  <li v-for='(action, index) in actions.col2' :key='`actions-${index}`'>{{ $t(`home.action.${action}`) }}</li>
                  <li>{{ $t(`home.summary.${navigation.to.name === 'notes' ? 'export1' : 'export2'}`) }}</li>
                </ul>
              </div>
              <b-link class='card-link' :to='navigation.to'>{{ $t('home.summary.to_route') }}</b-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script src='./home.js'></script>
