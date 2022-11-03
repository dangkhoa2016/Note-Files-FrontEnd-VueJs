<template>

  <div id='tags-list'>
    <div class='card'>
      <div class='card-body'>
        <div class='d-md-flex justify-content-md-between'>
          <h1 class='mb-0'>{{ $t('tags.header') }}</h1>

          <div class='heading-elements'>
             <button type='button' class='btn btn-sm btn-outline-success waves-effect btn-reload'
              @click.prevent='loadTags' :disabled='savingTag || loadingTags'>
              <refresh-cw-icon size='1x' /> {{ $t('tags.refresh') }}
            </button>
            <b-dropdown :disabled='loadingTags'
              split size='sm'
              split-variant='outline-primary'
              variant='info' @click.prevent="addTemporatoryTag('unshift')"
              text='' toggle-text='' right
              class='waves-effect btn-reload mx-50'
            >
              <template #button-content>
                <plus-square-icon size='1x' /> {{ $t('tags.add_new') }}
              </template>
              <b-dropdown-item @click.prevent="addTemporatoryTag('unshift')">{{ $t('tags.add_new') }}</b-dropdown-item>
              <b-dropdown-item @click.prevent='setShowModalImport(true)'>{{ $t('tags.import') }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown :disabled='loadingTags'
              variant='warning' text='' size='sm'
              toggle-class='px-1' right
            >
              <template #button-content>
                <briefcase-icon size='1x' /> {{ $t('tags.export') }}
              </template>
              <b-dropdown-item @click="download('json')">
                <server-icon class='me-1' size='1x' />
                <span class='align-middle'>JSON</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>

        <b-row>
          <div class='col-12 col-sm-7 col-md-8 col-lg-9'>
            <label class='col-form-label' for='sel-tag'>{{ $t('tags.search') }}</label>
            <b-input-group size='sm'>
              <b-form-input size='sm'
                v-model='search' :placeholder="$t('placeholder_search')"
                type='search' autocomplete='off'
              ></b-form-input>
              <b-button :disabled='!search' @click="search = ''">{{ $t('tags.clear_search') }}</b-button>
            </b-input-group>
          </div>
          <div class='col-12 col-sm-5 col-md-4 col-lg-3'>
            <label class='col-form-label' for='sel-tag'>{{ $t('tags.filter_status') }}</label>

            <v-select :options='statusOptions' :placeholder="$t('select_placeholder')" v-model='status'
              :reduce='option => option.value' :clearable='false'
              :key='(new Date()).valueOf()' label='text'>
            </v-select>
          </div>
        </b-row>
      </div>
    </div>

    <b-row class='mb-1'>
      <div class='col-12 col-sm-6 text-center text-sm-start'>
        <label class='h5 text-success'> {{ $t('tags.total') }}: {{ loadingTags ? '?' : tags.length }}</label>
      </div>
      <div class='col-12 col-sm-6 text-center text-sm-end'>
        <label class='text-info mb-50 mb-sm-0'>{{ $t('tags.creating_new') }}: {{ loadingTags ? '?' : countTemporatory }}</label>
      </div>
    </b-row>

    <loading v-if='loadingTags' />
    <error v-else-if='!hasData && errorAction'>
      <p>{{ errorAction }}</p>
    </error>
    <error v-else-if='!hasData' type='warning'>
      <p>{{ $t('tags.no_tags') }}</p>
    </error>
    <div v-else>
      <tag-item :index='index' :data-tag='item' v-for='(item, index) in tags'
        :key='item.id' v-show='showItem(item)'></tag-item>
    </div>

    <div class='d-flex justify-content-between'>
      <button class='btn btn-icon btn-primary' type='button' @click.prevent="addTemporatoryTag('push')"
        :disabled='loadingTags'>
        <plus-icon size='1x' /> {{ $t('tags.add_new') }}
      </button>
      <button class='btn btn-icon btn-primary' type='button' @click.prevent="addTemporatoryTag('push')"
        :disabled='loadingTags'>
        <plus-icon size='1x' /> {{ $t('tags.add_new') }}
      </button>
    </div>

    <b-modal
      id='confirm-delete-tag' :no-close-on-backdrop='true'
      @show='setNeedLogin(false)' @ok='handleOk' centered
      ok-variant='danger' :ok-disabled='deletingTag'
      :ok-title="$t('tags.ok_title')"
      :cancel-title="$t('cancel_title')"
    >
      <template #modal-header='{ close }'>
        <h4 class='mb-0'>{{ $t('tags.modal_header') }}</h4>
        <button type='button' class='btn btn-close btn-sm' data-bs-dismiss='modal'
          :aria-label="$t('cancel_title')" @click.prevent='close()'></button>
      </template>

      <div class='modal-body'>
        <p>{{ $t('tags.confirm_message') }} [{{ confirmDeletedMessage }}] ?</p>
        <div class='col-12' :class="errorAction ? 'text-danger' : 'd-none'">
          {{ errorAction }}
        </div>
      </div>
    </b-modal>
  </div>

</template>

<script src='./tags.js'></script>
