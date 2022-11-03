<template>
  
  <div id='notes-list'>
    <div class='card'>
      <div class='card-body'>
        <div class='d-md-flex justify-content-md-between'>
          <h1 class='mb-0'>{{ $t('notes.header') }}</h1>
          <div class='heading-elements'>
            <button type='button' class='btn btn-sm btn-outline-success waves-effect btn-reload'
              @click.prevent='processSearch' :disabled='loadingNotes'>
              <refresh-cw-icon size='1x' />
              <span>{{ $t('notes.refresh') }}</span>
            </button>
            <b-dropdown :disabled='loadingNotes'
              split size='sm'
              split-variant='outline-primary'
              variant='info' @click.prevent='addNew'
              :text="$t('notes.edit')" toggle-text='' right
              class='waves-effect btn-reload mx-50'
            >
              <template #button-content>
                <plus-square-icon size='1x' /> {{ $t('notes.add_new') }}
              </template>
              <b-dropdown-item @click.prevent='addNew'>{{ $t('notes.add_new') }}</b-dropdown-item>
              <b-dropdown-item @click.prevent='setShowModalImport(true)'>{{ $t('notes.import') }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown :disabled='loadingNotes'
              variant='warning' text='' size='sm'
              toggle-class='px-1' right
            >
              <template #button-content>
                <briefcase-icon size='1x' /> {{ $t('notes.export') }}
              </template>
              <b-dropdown-item @click="download('json')">
                <server-icon class='me-1' size='1x' />
                <span class='align-middle'>JSON</span>
              </b-dropdown-item>
              <b-dropdown-item @click="download('zip')">
                <layers-icon class='me-1' size='1x' />
                <span class='align-middle'>ZIP</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <b-row>
          <div class='col-12 col-lg-6'>
            <label class='col-form-label' for='sel-tag'>{{ $t('notes.tags') }}</label>
            <v-select :options='tags' id='sel-tag' :placeholder="$t('select_placeholder')" v-model='filterTag'
              :reduce='option => option.id' label='name' multiple
              :disabled='loadingTags || !hasTags'>
              <template slot='option' slot-scope='option'>
                {{option.name}}
              </template>
            </v-select>
          </div>
          <div class='col-4 col-lg-2'>
            <label class='col-form-label' for='sel-perPage'>{{ $t('notes.per_page') }}</label>
            <v-select :options='notesPageOptions' :get-option-label="option => $t(option.text)"
              id='sel-perPage' :placeholder="$t('select_placeholder')" v-model='perPage'
              :reduce='option => option.value' label='text' :clearable='false'>
              <template slot='option' slot-scope='option'>
                {{ $t(option.text) }}
              </template>
            </v-select>
          </div>
          <div class='col-4 col-lg-2'>
            <label class='col-form-label' for='sel-sortBy'>{{ $t('notes.sort_by') }}</label>
            <v-select :options='notesSortOptions' :placeholder="$t('select_placeholder')"
              id='sel-sortBy' v-model='sortBy' :get-option-label="option => $t(option.text)"
              :reduce='option => option.value' label='text' :clearable='false'>
              <template slot='option' slot-scope='option'>
                {{ $t(option.text) }}
              </template>
            </v-select>
          </div>
          <div class='col-4 col-lg-2'>
            <label class='col-form-label' for='sel-sortDirection'>{{ $t('notes.sort_direction') }}</label>
            <v-select :options='directionOptions' :placeholder="$t('select_placeholder')"
              id='sel-sortDirection' v-model='sortDirection' :get-option-label="option => $t(option.text)"
              :reduce='option => option.value' label='text' :clearable='false'>
              <template slot='option' slot-scope='option'>
                {{ $t(option.text) }}
              </template>
            </v-select>
          </div>
        </b-row>
      </div>
    </div>

    <loading v-if='loadingNotes' />
    <error v-if='errorAction'>
      <p>{{ errorAction }}</p>
    </error>
    <div v-else-if='hasData' class='mt-2'>
      <b-row>
        <b-col cols='sm-6' class='col-md-6 align-items-center d-flex justify-content-md-center justify-content-end'>
          {{ $t('notes.total') }}: {{ totalRows }}
        </b-col>
        <b-col cols='sm-6' class='col-md-6 mt-sm-1 mt-md-0'>
          <b-pagination
            v-model='currentPage' @change='onPageIndexChanged'
            :total-rows='totalRows'
            :per-page='perPage' size='lg'
            class='my-0 justify-content-center'
          ></b-pagination>
        </b-col>
      </b-row>

      <b-row class='row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5 g-2 my-1'>
        <note-item v-for='(note, index) in notes' :note='note' :key='index' />
      </b-row>

      <b-row>
        <b-col cols='sm-12' class='col-md-6 align-items-center d-flex justify-content-md-center justify-content-end'>
          {{ $t('notes.total') }}: {{ totalRows }}
        </b-col>
        <b-col cols='sm-12' class='col-md-6 mt-sm-1 mt-md-0'>
          <b-pagination
            v-model='currentPage' @change='onPageIndexChanged'
            :total-rows='totalRows'
            :per-page='perPage' size='lg'
            class='my-0 justify-content-center'
          ></b-pagination>
        </b-col>
      </b-row>
    </div>
    <div v-else-if='!loadingNotes' class='alert alert-primary mt-2' role='alert'>
      <div class='alert-body text-center'>
        <alert-circle-icon />
        <span>{{ $t(`notes.${hasSearchCriteria ? 'not_found_with_criteria' : 'no_notes'}`) }}</span>
      </div>
    </div>

    <div class='d-flex justify-content-between'>
      <button class='btn btn-icon btn-primary' type='button' @click.prevent='addNew' :disabled='loadingNotes'>
        <plus-icon size='1x' />
        <span>{{ $t('notes.add_new') }}</span>
      </button>
      <button class='btn btn-icon btn-primary' type='button' @click.prevent='addNew' :disabled='loadingNotes'>
        <plus-icon size='1x' />
        <span>{{ $t('notes.add_new') }}</span>
      </button>
    </div>
  </div>

</template>

<script src='./notes.js'></script>
